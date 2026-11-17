/**
 * Inheritance modes of enhanced availability: what the dimensions below the product-site-month
 * level, currently packages and tables, inherit from their site-month. The data availability API
 * determines the technical availability of a site-month (its "available" property) separately from
 * the categorical statuses of site-months, packages, and tables (Expected, Partial, etc.).
 * * TECHNICAL_AVAILABILITY: an available site-month is available for every package and table the
 *   site reports, overriding their categorical statuses. Packages and tables also inherit the
 *   categorical status of their site-month as with CATEGORICAL_STATUS.
 * * CATEGORICAL_STATUS: technical availability is not inherited. A package or table the site-month
 *   lists without a categorical status of its own inherits the categorical status of the
 *   site-month.
 * * NONE: nothing is inherited, so packages and tables only show their own categorical statuses
 * Product-site-month level rows (states, domains, and sites views) are the same in every
 * inheritance mode.
 */
export enum AvailabilityInheritanceMode {
  TECHNICAL_AVAILABILITY = 'TECHNICAL_AVAILABILITY',
  CATEGORICAL_STATUS = 'CATEGORICAL_STATUS',
  NONE = 'NONE',
}

export const AVAILABILITY_INHERITANCE_MODES: AvailabilityInheritanceMode[] = Object.values(
  AvailabilityInheritanceMode,
);

// Inheritance mode used wherever one is not specified
export const DEFAULT_AVAILABILITY_INHERITANCE_MODE = (
  AvailabilityInheritanceMode.TECHNICAL_AVAILABILITY
);

export const isAvailabilityInheritanceMode = (
  value: unknown,
): value is AvailabilityInheritanceMode => (
  AVAILABILITY_INHERITANCE_MODES.includes(value as AvailabilityInheritanceMode)
);

// Resolve an inheritance mode, using the default inheritance mode for any value that is not one
export const resolveInheritanceMode = (value: unknown): AvailabilityInheritanceMode => (
  isAvailabilityInheritanceMode(value) ? value : DEFAULT_AVAILABILITY_INHERITANCE_MODE
);
