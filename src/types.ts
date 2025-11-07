export interface Institution {
  id: string;
  name: string;
  category?: string | null;
  country?: string | null;
  description?: string | null;
  website?: string | null;
  total_assets?: number | null;
  image_url?: string | null;
  custom_fields?: Record<string, string | number | null> | null;
  [key: string]: unknown;
}

export type InstitutionInput = Omit<Institution, 'custom_fields'> & {
  custom_fields?: Record<string, string | number | null> | null;
};
