import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendInstitutionRequest } from '../utils/emailService';

interface FormData {
  requesterEmail: string;
  institutionName: string;
  institutionUrl: string;
  comment: string;
}

export default function RequestInstitution() {
  const [formData, setFormData] = useState<FormData>({
    requesterEmail: '',
    institutionName: '',
    institutionUrl: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await sendInstitutionRequest(formData);
      
      // Store the requester email for the success message
      setSubmittedEmail(formData.requesterEmail);
      
      setSubmitted(true);
      setFormData({
        requesterEmail: '',
        institutionName: '',
        institutionUrl: '',
        comment: '',
      });
    } catch (err) {
      console.error('❌ Form submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      console.error('Error details:', {
        message: errorMessage,
        error: err,
      });
      
      if (errorMessage.includes('not configured')) {
        setError(
          'Email service is not configured. ' +
          'Please check the browser console for debug information and contact the administrator.'
        );
      } else {
        setError(`Failed to submit request: ${errorMessage}. Please try again or contact us directly.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your request. We've received your submission and will review it shortly.
                {submittedEmail && (
                  <> A confirmation email has been sent to <strong>{submittedEmail}</strong>.</>
                )}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/institutions"
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Browse Institutions
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedEmail('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/institutions"
            className="inline-flex items-center text-sm text-blue-700 hover:text-blue-800 mb-6"
          >
            ← Back to Institutions
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Request to Add Institution</h1>
          <p className="text-gray-600">
            Know an institution that should be included? Fill out the form below and we'll review it.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="requesterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="requesterEmail"
                required
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                A confirmation email will be sent to this address
              </p>
            </div>

            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="institutionName"
                required
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., JP Morgan Chase"
              />
            </div>

            <div>
              <label htmlFor="institutionUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Institution Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="institutionUrl"
                required
                value={formData.institutionUrl}
                onChange={(e) => setFormData({ ...formData, institutionUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                id="comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about the institution..."
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <Link
                to="/institutions"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}