import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Institution } from '../types';
import { fetchInstitutionById } from '../utils/institutionsService';

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!id) {
          setInstitution(null);
          return;
        }

        const record = await fetchInstitutionById(id);
        setInstitution(record);
      } catch (error) {
        console.error('❌ Error loading institution data:', error);
        setInstitution(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Institution Not Found</h1>
            <p className="text-gray-600 mb-6">The institution you're looking for doesn't exist.</p>
            <Link
              to="/institutions"
              className="inline-block px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              ← Back to Institutions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/institutions"
          className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 mb-6"
        >
          ← Back to Institutions
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{institution.name}</h1>
              <p className="text-lg text-gray-600">{institution.country}</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md">
              {institution.category}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{institution.description}</p>
          </div>

          {institution.website && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Website</h2>
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                {institution.website}
              </a>
            </div>
          )}

          {/* Additional fields beyond the core set */}
          {(() => {
            const excludedKeys = ['id', 'name', 'category', 'country', 'description', 'website'];
            const additionalFields = Object.keys(institution).filter((key) => !excludedKeys.includes(key));

            if (additionalFields.length === 0) return null;

            return (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h2>
                <dl className="space-y-3">
                  {additionalFields.map((key) => {
                    const value = institution[key];
                    if (value === undefined || value === null || value === '') {
                      return null;
                    }

                    const displayValue =
                      typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

                    if (displayValue.trim() === '') {
                      return null;
                    }

                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim();

                    return (
                      <div key={key}>
                        <dt className="text-sm font-medium text-gray-500">{formattedKey}</dt>
                        <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{displayValue}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
