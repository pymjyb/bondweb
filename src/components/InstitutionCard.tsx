import { Link } from 'react-router-dom';
import { Institution } from '../types';

interface InstitutionCardProps {
  institution: Institution;
}

export default function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <Link
      to={`/institutions/${institution.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{institution.name}</h3>
        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md">
          {institution.category}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{institution.country}</p>
      
      <p className="text-sm text-gray-700 line-clamp-2">{institution.description}</p>
    </Link>
  );
}
