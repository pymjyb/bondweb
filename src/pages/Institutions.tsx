import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadCSVData, toInstitution } from '../utils/csvParser';
import { mergeInstitutions, getStorageData, InstitutionEdit } from '../utils/storage';
import InstitutionCard from '../components/InstitutionCard';

export default function Institutions() {
  const [institutions, setInstitutions] = useState<InstitutionEdit[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<InstitutionEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        setFilteredInstitutions(merged);
      } catch (err) {
        console.error('Failed to load institutions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter institutions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInstitutions(institutions);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = institutions.filter(inst => {
      // Search in name, category, country, and description
      const name = (inst.name || '').toLowerCase();
      const category = (inst.category || '').toLowerCase();
      const country = (inst.country || '').toLowerCase();
      const description = (inst.description || '').toLowerCase();
      
      return name.includes(query) ||
             category.includes(query) ||
             country.includes(query) ||
             description.includes(query);
    });
    
    setFilteredInstitutions(filtered);
  }, [searchQuery, institutions]);

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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Institutions</h1>
              <p className="text-gray-600">
                {filteredInstitutions.length} of {institutions.length} {institutions.length === 1 ? 'institution' : 'institutions'} 
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <Link
              to="/request-institution"
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
            >
              + Request Institution
            </Link>
          </div>
          
          {/* Search Box */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, country, or description..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {filteredInstitutions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery 
                ? `No institutions found matching "${searchQuery}".` 
                : 'No institutions found.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-700 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <InstitutionCard key={institution.id} institution={institution} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
