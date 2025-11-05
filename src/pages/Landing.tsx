import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to GovBond Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive platform for exploring government bond investors and issuers.
            Connect with key players in the government bond market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/investors"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              Explore Investors
            </Link>
            <Link
              to="/issuers"
              className="inline-block px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-md font-medium hover:bg-primary-50 transition-colors"
            >
              Explore Issuers
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Investors</h2>
            <p className="text-gray-600 mb-4">
              Discover institutional investors, pension funds, and asset managers active in the
              government bond market.
            </p>
            <Link
              to="/investors"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              View all investors →
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Issuers</h2>
            <p className="text-gray-600 mb-4">
              Explore government entities and institutions that issue bonds in the market.
            </p>
            <Link
              to="/issuers"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              View all issuers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

