import { useEffect, useState } from 'react';
import Card from './Card';
import { loadCSVData } from '../utils/csvParser';

interface ListPageProps {
  type: 'investors' | 'issuers';
}

export default function ListPage({ type }: ListPageProps) {
  const [items, setItems] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const baseUrl = new URL(import.meta.env.BASE_URL || '/', window.location.origin);
      const csvUrl = new URL(`data/${type}.csv`, baseUrl);
      const data = await loadCSVData(csvUrl.toString());
      setItems(data);
      setLoading(false);
    };
    loadData();
  }, [type]);

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

  const title = type === 'investors' ? 'Investors' : 'Issuers';
  const basePath = `/${type}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'entry' : 'entries'} found
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No {type} found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item.id || item.name}
                id={item.id || item.name.toLowerCase().replace(/\s+/g, '-')}
                name={item.name}
                description={item.description || ''}
                image={item.image}
                basePath={basePath}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
