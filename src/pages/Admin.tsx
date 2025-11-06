import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadCSVData, toInstitution } from '../utils/csvParser';
import {
  getStorageData,
  addInstitution,
  updateInstitution,
  deleteInstitution,
  addCustomField,
  removeCustomField,
  clearAllEdits,
  mergeInstitutions,
  downloadCSV,
  InstitutionEdit,
} from '../utils/storage';
import { isAuthenticated, logout } from '../utils/auth';

export default function Admin() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<InstitutionEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [formData, setFormData] = useState<Partial<InstitutionEdit>>({});
  const [customFields, setCustomFields] = useState<string[]>([]);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.BASE_URL;
      const csvPath = `${baseUrl}data/institutions.csv`;
      const data = await loadCSVData(csvPath);
      const csvInsts = data.map(toInstitution) as InstitutionEdit[];
      
      const storageData = getStorageData();
      setCustomFields(storageData.customFields);
      
      const merged = mergeInstitutions(csvInsts, storageData.customFields);
      setInstitutions(merged);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    if (newFieldName.trim() && !customFields.includes(newFieldName.trim())) {
      addCustomField(newFieldName.trim());
      setCustomFields([...customFields, newFieldName.trim()]);
      setNewFieldName('');
      loadData(); // Reload to apply field to all entries
    }
  };

  const handleRemoveField = (fieldName: string) => {
    removeCustomField(fieldName);
    setCustomFields(customFields.filter(f => f !== fieldName));
    loadData();
  };

  const handleAdd = () => {
    if (!formData.id || !formData.name) {
      alert('ID and Name are required');
      return;
    }
    
    // Check if ID already exists
    if (institutions.some(inst => inst.id === formData.id)) {
      alert('An institution with this ID already exists');
      return;
    }
    
    addInstitution(formData as InstitutionEdit);
    setShowAddForm(false);
    setFormData({});
    loadData();
  };

  const handleUpdate = (id: string) => {
    const inst = institutions.find(i => i.id === id);
    if (inst) {
      updateInstitution(id, inst);
      setEditingId(null);
      loadData();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this institution?')) {
      deleteInstitution(id);
      loadData();
    }
  };

  const handleExport = () => {
    downloadCSV(institutions, 'institutions_updated.csv');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all edits? This cannot be undone.')) {
      clearAllEdits();
      loadData();
    }
  };

  const allFields = institutions.length > 0 
    ? Object.keys(institutions[0])
    : ['id', 'name', 'category', 'country', 'description', 'website', ...customFields];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage institutions and custom fields</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
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

        {/* Custom Fields Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Fields</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="New field name (e.g., 'foundedYear', 'assets')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
            />
            <button
              onClick={handleAddField}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Add Field
            </button>
          </div>
          {customFields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customFields.map(field => (
                <span
                  key={field}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                >
                  {field}
                  <button
                    onClick={() => handleRemoveField(field)}
                    className="ml-2 text-blue-700 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add Institution'}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
          >
            Clear All Edits
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Institution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field} {field === 'id' || field === 'name' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    value={formData[field] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={field === 'id' || field === 'name'}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                Add Institution
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({});
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Institutions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {allFields.map(field => (
                    <th
                      key={field}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {institutions.map((inst) => (
                  <tr key={inst.id} className={editingId === inst.id ? 'bg-blue-50' : ''}>
                    {allFields.map(field => (
                      <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === inst.id ? (
                          <input
                            type="text"
                            value={inst[field] || ''}
                            onChange={(e) => {
                              const updated = institutions.map(i =>
                                i.id === inst.id ? { ...i, [field]: e.target.value } : i
                              );
                              setInstitutions(updated);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          <div className="truncate max-w-xs">{inst[field] || '-'}</div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === inst.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(inst.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              loadData();
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(inst.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(inst.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {institutions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <p className="text-gray-500">No institutions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
