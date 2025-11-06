function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Push last field
  values.push(current.trim());
  
  return values;
}

export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }
  
  return rows;
}

export async function loadCSVData(filePath: string): Promise<Record<string, string>[]> {
  // Add cache-busting query parameter to ensure fresh data
  // Handle both absolute and relative paths
  const separator = filePath.includes('?') ? '&' : '?';
  const urlWithCache = `${filePath}${separator}v=${Date.now()}`;
  
  const response = await fetch(urlWithCache, {
    cache: 'no-cache',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
  }
  
  const csvText = await response.text();
  return parseCSV(csvText);
}

// Helper function to convert Record to Institution
// Returns InstitutionEdit type to preserve all fields from CSV (including custom fields)
export function toInstitution(data: Record<string, string>): Record<string, string> {
  // Return the full record to preserve all fields including custom ones like "Total assets"
  return { ...data };
}
