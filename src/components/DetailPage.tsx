import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadCSVData } from '../utils/csvParser';

interface DetailPageProps {
  type: 'investors' | 'issuers';
}

export default function DetailPage({ type }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Public assets are served from root, base path is handled automatically
      const data = await loadCSVData(`${import.meta.env.BASE_URL}data/${type}.csv`);
      const found = data.find(
        (row) => row.id === id || row.name.toLowerCase().replace(/\s+/g, '-') === id
      );
      setItem(found || null);
      setLoading(false);
    };
    loadData();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h1>
            <p className="text-gray-600 mb-6">The {type.slice(0, -1)} you're looking for doesn't exist.</p>
            <Link
              to={`/${type}`}
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to {type === 'investors' ? 'Investors' : 'Issuers'}
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
          to={`/${type}`}
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-6"
        >
          ← Back to {type === 'investors' ? 'Investors' : 'Issuers'}
        </Link>

        <div className="card p-8">
          {item.image && (
            <div className="w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>

          {item.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {item.keyData && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Key Data</h2>
              <p className="text-gray-700">{item.keyData}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-3">
            {item.contact && (
              <div>
                <span className="text-sm font-medium text-gray-500">Contact:</span>
                <span className="ml-2 text-gray-900">{item.contact}</span>
              </div>
            )}

            {item.link && (
              <div>
                <span className="text-sm font-medium text-gray-500">Website:</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  {item.link}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
