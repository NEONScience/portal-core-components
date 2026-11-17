import {
  API_STATUS_MAP,
  PROVISIONAL_RELEASE,
  TABLE_COMPONENT_TYPE,
} from './AvailabilityUtils';
import {
  AvailabilityInheritanceMode,
  DEFAULT_AVAILABILITY_INHERITANCE_MODE,
  resolveInheritanceMode,
} from './EnhancedAvailabilityInheritance';
import { isStringNonEmpty } from '../../util/typeUtil';

/**
   Component (package / table) level status calculation for enhanced availability.
   Kept separate from the site-month and rollup status calculations.
*/

const getComponentKey = (packageType, tableName) => `${packageType}/${tableName}`;

/**
   Get the statuses of a single package / table component for one site-month of a release with an
   inheritance mode, one of AvailabilityInheritanceMode (anything else uses the default):
   * With the TECHNICAL_AVAILABILITY inheritance mode an available site-month uses its
     availability status, overriding any component status
   * Otherwise each time the site-month lists the component, the status of the component is
     used. A listed component without a status of its own (null or empty) inherits the site-month
     status, except with the NONE inheritance mode. Components the site-month does not list have
     no status.
   componentStatuses are the statuses of each listing of the component in the site-month, empty
   when the site-month does not list the component. Statuses that are not known API statuses are
   ignored. Returns an array of enhanced statuses, empty when no status applies.
*/
export const calcComponentStatuses = (
  siteMonth,
  release,
  componentStatuses = [],
  inheritanceMode = DEFAULT_AVAILABILITY_INHERITANCE_MODE,
) => {
  const mode = resolveInheritanceMode(inheritanceMode);
  if (siteMonth?.available && (mode === AvailabilityInheritanceMode.TECHNICAL_AVAILABILITY)) {
    return [release === PROVISIONAL_RELEASE ? 'available-provisional' : 'available'];
  }
  const inheritedStatus = (mode === AvailabilityInheritanceMode.NONE) ? null : siteMonth?.status;
  return componentStatuses
    .map((status) => API_STATUS_MAP[isStringNonEmpty(status) ? status : inheritedStatus])
    .filter((status) => !!status);
};

/**
   Get every package / table component reported by each site across its releases, in the order
   first reported
*/
const getSiteComponents = (siteCodes) => {
  const siteComponents = new Map();
  siteCodes.forEach(({ siteCode, availableReleases }) => {
    if (!siteComponents.has(siteCode)) { siteComponents.set(siteCode, new Map()); }
    const components = siteComponents.get(siteCode);
    (availableReleases || []).forEach(({ months }) => {
      (months || []).forEach(({ packages }) => {
        (packages || []).forEach(({ packageType, components: packageComponents }) => {
          (packageComponents || []).forEach(({ name, type }) => {
            const key = getComponentKey(packageType, name);
            if ((type !== TABLE_COMPONENT_TYPE) || components.has(key)) { return; }
            components.set(key, { packageType, tableName: name });
          });
        });
      });
    });
  });
  return siteComponents;
};

/**
   Calculate package / table component rows from the "siteCodes" of an enhanced availability API
   response with an inheritance mode, one of AvailabilityInheritanceMode. A site has a row for
   every package / table it reports and no others, so breakouts never associate a site (or its
   state or domain) with packages / tables it does not report. With the TECHNICAL_AVAILABILITY
   inheritance mode the availability of an available site-month applies to every package / table
   the site reports, whether or not the site-month lists them. Otherwise site-months only apply
   statuses to the components they list, see calcComponentStatuses. Rows are kept without any
   statuses, e.g. for a table only listed without a status with the NONE inheritance mode.
   Returns [{ siteCode, packageType, tableName, months: { [YYYY-MM]: [status, ...] } }] with the
   statuses of each month across all releases left unresolved.
*/
export const calcComponentRows = (
  siteCodes = [],
  inheritanceMode = DEFAULT_AVAILABILITY_INHERITANCE_MODE,
) => {
  const siteComponents = getSiteComponents(siteCodes);
  const rows = new Map();
  siteCodes.forEach(({ siteCode, availableReleases }) => {
    const components = siteComponents.get(siteCode);
    components.forEach(({ packageType, tableName }, key) => {
      const rowKey = `${siteCode}/${key}`;
      if (!rows.has(rowKey)) {
        rows.set(rowKey, {
          siteCode,
          packageType,
          tableName,
          months: {},
        });
      }
    });
    (availableReleases || []).forEach(({ release, months }) => {
      (months || []).forEach((siteMonth) => {
        const reportedStatuses = new Map();
        (siteMonth.packages || []).forEach(({ packageType, components: packageComponents }) => {
          (packageComponents || []).forEach(({ name, type, status }) => {
            if (type !== TABLE_COMPONENT_TYPE) { return; }
            const key = getComponentKey(packageType, name);
            reportedStatuses.set(key, [...(reportedStatuses.get(key) || []), status]);
          });
        });
        components.forEach((component, key) => {
          const statuses = calcComponentStatuses(
            siteMonth,
            release,
            reportedStatuses.get(key),
            inheritanceMode,
          );
          if (!statuses.length) { return; }
          const { months: rowMonths } = rows.get(`${siteCode}/${key}`);
          rowMonths[siteMonth.month] = [...(rowMonths[siteMonth.month] || []), ...statuses];
        });
      });
    });
  });
  return Array.from(rows.values());
};
