function parseCSVLine(line: string, delimiter: string = ','): string[] {
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
    } else if (char === delimiter && !inQuotes) {
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

  // Detect delimiter: check if first line contains semicolon or comma
  // Prefer semicolon if present, otherwise use comma
  const firstLine = lines[0];
  const hasSemicolon = firstLine.includes(';');
  const delimiter = hasSemicolon ? ';' : ',';
  
  // Parse header
  const headers = parseCSVLine(lines[0], delimiter);
  
  // Parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = parseCSVLine(line, delimiter);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || '').trim();
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
  
  console.log('📊 Loading CSV from:', urlWithCache);
  console.log('📊 BASE_URL:', import.meta.env.BASE_URL);
  
  try {
    const response = await fetch(urlWithCache, {
      cache: 'no-cache',
    });
    
    console.log('📊 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      console.error('❌ Failed to load CSV:', {
        status: response.status,
        statusText: response.statusText,
        url: urlWithCache,
        errorText: errorText.substring(0, 200)
      });
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}. URL: ${urlWithCache}`);
    }
    
    const csvText = await response.text();
    console.log('✅ CSV loaded, length:', csvText.length, 'characters');
    
    const parsed = parseCSV(csvText);
    console.log('✅ Parsed', parsed.length, 'institutions');
    
    return parsed;
  } catch (error) {
    console.error('❌ Error loading CSV:', error);
    throw error;
  }
}

// Helper function to convert Record to Institution
// Returns InstitutionEdit type to preserve all fields from CSV (including custom fields)
export function toInstitution(data: Record<string, string>): Record<string, string> {
  // Return the full record to preserve all fields including custom ones like "Total assets"
  return { ...data };
}
