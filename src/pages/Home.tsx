import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Open Source Financial Data Hub
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Free access to public data about institutions and players in global capital markets.
          </p>
          
          <Link
            to="/institutions"
            className="inline-block px-8 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Browse Institutions
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">100+</div>
            <div className="text-gray-600">Financial Institutions</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">50+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-blue-700 mb-2">Open</div>
            <div className="text-gray-600">Source Data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
