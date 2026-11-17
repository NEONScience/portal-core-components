import { z } from 'zod';

import { Nullable } from '../../types/core';

/**
 * Levels of detail enhanced availability is reported at, matching the dataLevel parameter
 * of the data availability API endpoint:
 * * MONTHLY: each site-month reports its availability and status
 * * COMPONENT: site-months may also report the status of each package / table component
 */
export enum AvailabilityDataLevel {
  MONTHLY = 'MONTHLY',
  COMPONENT = 'COMPONENT',
}

export const AVAILABILITY_DATA_LEVELS: AvailabilityDataLevel[] = Object.values(
  AvailabilityDataLevel,
);

export const isAvailabilityDataLevel = (value: unknown): value is AvailabilityDataLevel => (
  AVAILABILITY_DATA_LEVELS.includes(value as AvailabilityDataLevel)
);

// Statuses are not limited to the known API statuses, unknown statuses are ignored when parsed
const statusSchema = z.string().nullish();

const componentSchema = z.object({
  name: z.string(),
  type: z.string(),
  status: statusSchema,
});

const packageSchema = z.object({
  packageType: z.string(),
  components: z.array(componentSchema),
});

/**
 * Build the schema of the "data" object of a data availability API response, where the months
 * of each site and release validate their packages with the given schema
 */
const buildAvailabilitySchema = <T extends z.ZodType>(packagesSchema: T) => z.object({
  productCode: z.string().nullish(),
  siteCodes: z.array(z.object({
    siteCode: z.string(),
    availableReleases: z.array(z.object({
      release: z.string(),
      months: z.array(z.object({
        month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected a YYYY-MM month'),
        available: z.boolean(),
        status: statusSchema,
        packages: packagesSchema,
      })),
    })),
  })),
});

export const monthlyAvailabilitySchema = buildAvailabilitySchema(
  z.array(packageSchema)
    .max(0, 'MONTHLY level availability does not include package components')
    .nullish(),
);

export const componentAvailabilitySchema = buildAvailabilitySchema(
  z.array(packageSchema).nullish(),
);

export type MonthlyAvailability = z.infer<typeof monthlyAvailabilitySchema>;
export type ComponentAvailability = z.infer<typeof componentAvailabilitySchema>;
// Monthly availability is component availability without package components so shares its type
export type EnhancedAvailability = ComponentAvailability;

export const AVAILABILITY_SCHEMAS = {
  [AvailabilityDataLevel.MONTHLY]: monthlyAvailabilitySchema,
  [AvailabilityDataLevel.COMPONENT]: componentAvailabilitySchema,
};

type AvailabilityParseResult = z.ZodSafeParseResult<EnhancedAvailability>;

interface DetectedAvailabilityParseResult {
  dataLevel: Nullable<AvailabilityDataLevel>;
  result: AvailabilityParseResult;
}

/**
 * Parse availability with the schema of each data level, from least to most detailed, until the
 * availability validates. Monthly availability is a subset of component availability so is
 * parsed first.
 */
const parseDetectingDataLevel = (availability: unknown): DetectedAvailabilityParseResult => {
  const monthlyResult = monthlyAvailabilitySchema.safeParse(availability);
  if (monthlyResult.success) {
    return { dataLevel: AvailabilityDataLevel.MONTHLY, result: monthlyResult };
  }
  const componentResult = componentAvailabilitySchema.safeParse(availability);
  return {
    dataLevel: componentResult.success ? AvailabilityDataLevel.COMPONENT : null,
    result: componentResult,
  };
};

const MAX_REPORTED_ISSUES = 3;

const formatIssuePath = (path: PropertyKey[]): string => path.reduce<string>(
  (formatted: string, key: PropertyKey): string => {
    if (typeof key === 'number') {
      return `${formatted}[${key}]`;
    }
    return formatted ? `${formatted}.${String(key)}` : String(key);
  },
  '',
);

/**
 * Format the first few issues of a failed validation, e.g.
 * "siteCodes[0].availableReleases: Invalid input: expected array, received undefined"
 */
const formatIssues = (error: z.ZodError): string => {
  const { issues } = error;
  const formatted = issues.slice(0, MAX_REPORTED_ISSUES).map((issue): string => {
    const path = formatIssuePath(issue.path);
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  const remaining = issues.length - MAX_REPORTED_ISSUES;
  return `${formatted.join('; ')}${remaining > 0 ? ` (and ${remaining} more)` : ''}`;
};

/**
 * Detect the data level of enhanced availability data from the schema it validates against,
 * from least to most detailed. Data without any package components are detected as MONTHLY.
 * Returns null when the data do not validate against any data level schema.
 */
export const detectAvailabilityDataLevel = (
  availability: unknown,
): Nullable<AvailabilityDataLevel> => parseDetectingDataLevel(availability).dataLevel;

export interface EnhancedAvailabilityValidation {
  // The validated availability, null when not valid
  availability: Nullable<EnhancedAvailability>;
  // The specified data level, otherwise the detected data level
  dataLevel: Nullable<AvailabilityDataLevel>;
  // Why the availability is not valid, null when valid
  error: Nullable<string>;
}

/**
 * Validate enhanced availability data (the "data" object of a data availability API response).
 * Without a data level the data level is detected from the data. With a data level the data must
 * agree with it: COMPONENT level data without any package components agree with either data
 * level, while data with package components only agree with the COMPONENT data level.
 */
export const validateEnhancedAvailability = (
  availability: unknown,
  dataLevel: Nullable<AvailabilityDataLevel> = null,
): EnhancedAvailabilityValidation => {
  if (!isAvailabilityDataLevel(dataLevel)) {
    // Failing to detect a data level reports the issues of the least restrictive schema
    const { dataLevel: detectedDataLevel, result } = parseDetectingDataLevel(availability);
    if (result.success) {
      return { availability: result.data, dataLevel: detectedDataLevel, error: null };
    }
    return {
      availability: null,
      dataLevel: null,
      error: `Availability data do not match a ${AVAILABILITY_DATA_LEVELS.join(' or ')} `
        + `level schema: ${formatIssues(result.error)}`,
    };
  }
  const result = AVAILABILITY_SCHEMAS[dataLevel].safeParse(availability);
  if (result.success) {
    return { availability: result.data, dataLevel, error: null };
  }
  const detectedDataLevel = detectAvailabilityDataLevel(availability);
  return {
    availability: null,
    dataLevel,
    error: detectedDataLevel
      ? `Expected ${dataLevel} level availability data but found ${detectedDataLevel} level data`
      : `Invalid ${dataLevel} level availability data: ${formatIssues(result.error)}`,
  };
};
