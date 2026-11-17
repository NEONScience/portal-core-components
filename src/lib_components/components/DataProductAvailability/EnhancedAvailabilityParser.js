import {
  API_STATUS_MAP,
  AVAILABLE_STATUSES,
  PROVISIONAL_RELEASE,
  TABLE_COMPONENT_TYPE,
  calcRollupStatus,
} from './AvailabilityUtils';
import { calcComponentRows } from './EnhancedAvailabilityComponentStatus';

/**
   Resolve all statuses reported for a single cell (e.g. one site-month across releases).
   Availability in any release takes precedence over any reported status, and data available
   as both released and provisional resolves to the mixed released / provisional status.
*/
export const resolveCellStatus = (statuses = []) => {
  const unique = Array.from(new Set(statuses));
  const available = unique.filter((status) => AVAILABLE_STATUSES.includes(status));
  if (available.length) {
    return available.length === 1 ? available[0] : 'mixed-available-provisional';
  }
  return calcRollupStatus(unique);
};

const resolveMonths = (monthStatuses) => Object.keys(monthStatuses)
  .reduce((acc, month) => {
    const status = resolveCellStatus(monthStatuses[month]);
    if (status) { acc[month] = status; }
    return acc;
  }, {});

/**
   Parse the "data" object of an enhanced availability API response into:
   * siteMonths: { [siteCode]: { [YYYY-MM]: status } } with statuses resolved across releases
   * componentRows: [{ siteCode, packageType, tableName, months: { [YYYY-MM]: status } }]
       with statuses resolved across releases. Component statuses are calculated separately with
       the inheritance mode, one of AvailabilityInheritanceMode (see
       EnhancedAvailabilityComponentStatus), so site-months are the same in every inheritance mode.
   * tables: { [tableName]: { name, tableCode } }
   * hasComponents: whether any component (table) detail is present
*/
export const parseEnhancedAvailability = (availability, inheritanceMode) => {
  const siteStatuses = {};
  const siteCodes = Array.isArray(availability?.siteCodes) ? availability.siteCodes : [];
  siteCodes.forEach(({ siteCode, availableReleases }) => {
    if (!siteStatuses[siteCode]) { siteStatuses[siteCode] = {}; }
    (availableReleases || []).forEach(({ release, months }) => {
      (months || []).forEach(({
        month,
        available,
        status,
        packages,
      }) => {
        const monthComponentStatuses = [];
        (packages || []).forEach(({ components }) => {
          (components || []).forEach(({ type, status: componentStatus }) => {
            const mappedStatus = API_STATUS_MAP[componentStatus];
            if ((type !== TABLE_COMPONENT_TYPE) || !mappedStatus) { return; }
            monthComponentStatuses.push(mappedStatus);
          });
        });
        // A month without availability or a status of its own derives it from its components
        let statuses = monthComponentStatuses;
        if (available) {
          statuses = [release === PROVISIONAL_RELEASE ? 'available-provisional' : 'available'];
        } else if (API_STATUS_MAP[status]) {
          statuses = [API_STATUS_MAP[status]];
        }
        if (statuses.length) {
          siteStatuses[siteCode][month] = [...(siteStatuses[siteCode][month] || []), ...statuses];
        }
      });
    });
  });
  const siteMonths = Object.keys(siteStatuses).reduce((acc, siteCode) => {
    acc[siteCode] = resolveMonths(siteStatuses[siteCode]);
    return acc;
  }, {});
  const componentRows = calcComponentRows(siteCodes, inheritanceMode)
    .map((row) => ({ ...row, months: resolveMonths(row.months) }));
  const tableNames = Array.from(new Set(componentRows.map((row) => row.tableName))).sort();
  const tables = tableNames.reduce((acc, name, idx) => {
    acc[name] = { name, tableCode: `${name}` };
    return acc;
  }, {});
  return {
    productCode: availability?.productCode || null,
    siteMonths,
    componentRows,
    tables,
    hasComponents: componentRows.length > 0,
  };
};
