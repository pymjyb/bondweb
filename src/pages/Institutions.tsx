import { useEffect, useState } from 'react';
import { loadCSVData, toInstitution } from '../utils/csvParser';
import { mergeInstitutions, getStorageData, InstitutionEdit } from '../utils/storage';
import InstitutionCard from '../components/InstitutionCard';

export default function Institutions() {
  const [institutions, setInstitutions] = useState<InstitutionEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const csvPath = `${baseUrl}data/institutions.csv`;
        
        const data = await loadCSVData(csvPath);
        const csvInstitutions = data.map(toInstitution) as InstitutionEdit[];
        
        // Merge with localStorage edits
        const storageData = getStorageData();
        const merged = mergeInstitutions(csvInstitutions, storageData.customFields);
        setInstitutions(merged);
      } catch (err) {
        console.error('Failed to load institutions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="mt-4 text-gray-600">Loading institutions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <p className="text-gray-500 text-sm">
              Trying to load from: {import.meta.env.BASE_URL}data/institutions.csv
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Institutions</h1>
          <p className="text-gray-600">
            {institutions.length} {institutions.length === 1 ? 'institution' : 'institutions'} found
          </p>
        </div>

        {institutions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No institutions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution) => (
              <InstitutionCard key={institution.id} institution={institution} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
