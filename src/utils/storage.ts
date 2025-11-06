import { Institution } from '../types';

const STORAGE_KEY = 'institutions_edits';
const STORAGE_FIELDS_KEY = 'institutions_custom_fields';

export interface InstitutionEdit extends Institution {
  [key: string]: string; // Allow custom fields
}

export interface StorageData {
  additions: InstitutionEdit[];
  modifications: Record<string, InstitutionEdit>;
  deletions: string[];
  customFields: string[];
}

// Get all stored edits
export function getStorageData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const fields = localStorage.getItem(STORAGE_FIELDS_KEY);
    return {
      additions: data ? JSON.parse(data).additions || [] : [],
      modifications: data ? JSON.parse(data).modifications || {} : {},
      deletions: data ? JSON.parse(data).deletions || [] : [],
      customFields: fields ? JSON.parse(fields) : [],
    };
  } catch {
    return {
      additions: [],
      modifications: {},
      deletions: [],
      customFields: [],
    };
  }
}

// Save storage data
export function saveStorageData(data: StorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    additions: data.additions,
    modifications: data.modifications,
    deletions: data.deletions,
  }));
  localStorage.setItem(STORAGE_FIELDS_KEY, JSON.stringify(data.customFields));
}

// Add a new institution
export function addInstitution(institution: InstitutionEdit): void {
  const data = getStorageData();
  data.additions.push(institution);
  saveStorageData(data);
}

// Update an existing institution
export function updateInstitution(id: string, institution: InstitutionEdit): void {
  const data = getStorageData();
  data.modifications[id] = institution;
  saveStorageData(data);
}

// Delete an institution
export function deleteInstitution(id: string): void {
  const data = getStorageData();
  data.deletions.push(id);
  saveStorageData(data);
}

// Add a custom field
export function addCustomField(fieldName: string): void {
  const data = getStorageData();
  if (!data.customFields.includes(fieldName)) {
    data.customFields.push(fieldName);
    saveStorageData(data);
  }
}

// Remove a custom field
export function removeCustomField(fieldName: string): void {
  const data = getStorageData();
  data.customFields = data.customFields.filter(f => f !== fieldName);
  saveStorageData(data);
}

// Clear all edits
export function clearAllEdits(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_FIELDS_KEY);
}

// Merge CSV data with localStorage edits
export function mergeInstitutions(
  csvInstitutions: Institution[],
  customFields: string[] = []
): InstitutionEdit[] {
  const data = getStorageData();
  
  // Start with CSV data
  let merged: InstitutionEdit[] = csvInstitutions
    .filter(inst => !data.deletions.includes(inst.id))
    .map(inst => {
      // Apply modifications
      if (data.modifications[inst.id]) {
        return { ...inst, ...data.modifications[inst.id] };
      }
      // Add custom fields with empty values
      const withCustomFields: InstitutionEdit = { ...inst };
      customFields.forEach(field => {
        if (!(field in withCustomFields)) {
          withCustomFields[field] = '';
        }
      });
      return withCustomFields;
    });

  // Add new institutions
  data.additions.forEach(addition => {
    merged.push(addition);
  });

  // Add custom fields to all entries
  merged = merged.map(inst => {
    const withCustomFields: InstitutionEdit = { ...inst };
    customFields.forEach(field => {
      if (!(field in withCustomFields)) {
        withCustomFields[field] = '';
      }
    });
    return withCustomFields;
  });

  return merged;
}

// Export to CSV
export function exportToCSV(institutions: InstitutionEdit[]): string {
  if (institutions.length === 0) return '';
  
  // Get all field names from all institutions
  const allFields = new Set<string>();
  institutions.forEach(inst => {
    Object.keys(inst).forEach(key => allFields.add(key));
  });
  
  const fields = Array.from(allFields);
  const header = fields.join(',');
  
  const rows = institutions.map(inst => {
    return fields.map(field => {
      const value = inst[field] || '';
      // Escape commas and quotes in CSV
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

// Download CSV file
export function downloadCSV(institutions: InstitutionEdit[], filename: string = 'institutions.csv'): void {
  const csv = exportToCSV(institutions);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
