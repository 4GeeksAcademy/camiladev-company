export const VALID_CATEGORIES = [
  "job_boards",
  "ats_software",
  "assessment_tools",
  "training_platforms",
  "payroll_and_hr_software",
  "video_interview",
  "background_check",
  "office_and_facilities",
  "it_and_software_licenses",
] as const;

export const VALID_CURRENCIES = ["EUR", "USD"] as const;

export const VALID_STATUS = ["active", "suspended"] as const;

export const VALID_COUNTRY = ["Spain", "USA"] as const;

export type SupplierCategory = (typeof VALID_CATEGORIES)[number];
export type SupplierCurrency = (typeof VALID_CURRENCIES)[number];
export type SupplierStatus = (typeof VALID_STATUS)[number];
export type SupplierCountry = (typeof VALID_COUNTRY)[number];

export interface Supplier {
  id: number;
  name: string;
  country: SupplierCountry;
  categories: SupplierCategory[];
  monthly_rate: number;
  currency: SupplierCurrency;
  updated_at: string;
  status: SupplierStatus;
  contract_renewal_date?: string | null;
  contact_email?: string | null;
  notes?: string | null;
}

export interface SupplierCreateInput {
  name: string;
  country: SupplierCountry;
  categories: SupplierCategory[];
  monthly_rate: number;
  currency: SupplierCurrency;
  status: SupplierStatus;
  contract_renewal_date?: string | null;
  contact_email?: string | null;
  notes?: string | null;
}

export interface SupplierFilters {
  country?: SupplierCountry | "";
  category?: SupplierCategory | "";
}
