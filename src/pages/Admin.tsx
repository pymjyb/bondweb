import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from '../utils/institutionsService';
import { Institution, InstitutionInput } from '../types';
import { requireAdminSession, signOut } from '../utils/auth';

interface FormField {
  key: keyof InstitutionInput;
  label: string;
  required?: boolean;
  type?: 'text' | 'textarea' | 'number' | 'url';
}

const FORM_FIELDS: FormField[] = [
  { key: 'id', label: 'ID', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'category', label: 'Category' },
  { key: 'country', label: 'Country' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'total_assets', label: 'Total Assets (USD bn)', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const EMPTY_FORM: Partial<InstitutionInput> = {
  id: '',
  name: '',
  category: '',
  country: '',
  website: '',
  total_assets: undefined,
  description: '',
};

export default function Admin() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<InstitutionInput>>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        const session = await requireAdminSession();
        if (!isMounted) return;
        if (!session) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setIsAuthorized(true);
        setCheckingSession(false);
        await loadInstitutions();
      } catch (err) {
        console.error('Failed to verify admin session:', err);
        if (!isMounted) return;
        navigate('/admin/login', { replace: true });
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const loadInstitutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchInstitutions();
      setInstitutions(records);
    } catch (err) {
      console.error('Failed to load institutions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleFieldChange = (key: keyof InstitutionInput, value: string) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (key === 'total_assets') {
        next[key] = value === '' ? null : Number(value);
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const handleAddInstitution = async () => {
    if (!formData.id || !formData.name) {
      alert('ID and Name are required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload: InstitutionInput = {
        ...EMPTY_FORM,
        ...formData,
        total_assets:
          formData.total_assets === undefined || formData.total_assets === null
            ? null
            : Number(formData.total_assets),
      } as InstitutionInput;

      await createInstitution(payload);
      await loadInstitutions();
      resetForm();
    } catch (err) {
      console.error('Failed to create institution:', err);
      setError(err instanceof Error ? err.message : 'Failed to create institution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: Partial<InstitutionInput> = {
        ...formData,
        total_assets:
          formData.total_assets === undefined || formData.total_assets === null
            ? null
            : Number(formData.total_assets),
      };
      await updateInstitution(id, payload);
      await loadInstitutions();
      resetForm();
    } catch (err) {
      console.error('Failed to update institution:', err);
      setError(err instanceof Error ? err.message : 'Failed to update institution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this institution?');
    if (!confirmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await deleteInstitution(id);
      await loadInstitutions();
    } catch (err) {
      console.error('Failed to delete institution:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete institution');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (record: Institution) => {
    setEditingId(record.id);
    setFormData({
      id: record.id,
      name: record.name ?? '',
      category: record.category ?? '',
      country: record.country ?? '',
      website: record.website ?? '',
      total_assets:
        record.total_assets === undefined || record.total_assets === null
          ? null
          : Number(record.total_assets),
      description: record.description ?? '',
    });
  };

  const formatDisplayValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verifying access…</div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage institutions stored in Supabase</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await signOut();
                } finally {
                  navigate('/admin/login');
                }
              }}
              className="px-4 py-2 text-red-700 hover:text-red-800 text-sm"
            >
              Logout
            </button>
            <Link
              to="/institutions"
              className="px-4 py-2 text-blue-700 hover:text-blue-800"
            >
              ← Back to Institutions
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setFormData(EMPTY_FORM);
              setEditingId(null);
            }}
            disabled={!isAuthorized || submitting}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {showAddForm ? 'Cancel' : '+ Add Institution'}
          </button>
          <button
            onClick={loadInstitutions}
            disabled={!isAuthorized || submitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Institution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORM_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={(formData[field.key] as string) ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type ?? 'text'}
                      value={(formData[field.key] ?? '') as string | number}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddInstitution}
                disabled={!isAuthorized || submitting}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Institution'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {FORM_FIELDS.map((field) => (
                    <th
                      key={field.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {institutions.map((inst) => {
                  const isEditing = editingId === inst.id;
                  return (
                    <tr key={inst.id} className={isEditing ? 'bg-blue-50' : ''}>
                      {FORM_FIELDS.map((field) => (
                        <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {isEditing ? (
                            field.type === 'textarea' ? (
                              <textarea
                                value={(formData[field.key] as string) ?? ''}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              <input
                                type={field.type === 'number' ? 'number' : field.type ?? 'text'}
                                value={(formData[field.key] ?? '') as string | number}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            )
                          ) : (
                            <div className="truncate max-w-xs">
                              {formatDisplayValue(inst[field.key]) || '—'}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(inst.id)}
                              disabled={!isAuthorized || submitting}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={resetForm}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(inst)}
                              disabled={!isAuthorized}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(inst.id)}
                              disabled={!isAuthorized}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
