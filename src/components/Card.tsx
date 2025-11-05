import { Link } from 'react-router-dom';

interface CardProps {
  id: string;
  name: string;
  description: string;
  image?: string;
  basePath: string;
}

export default function Card({ id, name, description, image, basePath }: CardProps) {
  return (
    <Link to={`${basePath}/${id}`} className="block">
      <div className="card card-hover p-6 h-full">
        {image && (
          <div className="w-full h-48 mb-4 rounded-md overflow-hidden bg-gray-100">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}

