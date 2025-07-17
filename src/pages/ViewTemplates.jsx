// File: src/pages/ViewTemplates.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, Copy, Trash2, PlusCircle, Search } from 'lucide-react';
import { api } from '../utils/api';

const ViewTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await api.getForms();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const data = await api.searchForms(searchTerm);
        setTemplates(data);
      } catch (error) {
        console.error('Error searching templates:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchTemplates();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.deleteForm(id);
        setTemplates(templates.filter(t => t.id !== id));
        alert('Template deleted successfully');
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading templates...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Form Templates</h1>
        <Link
          to="/new-form"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Template
        </Link>
      </div>

      <div className="mb-6 flex items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Search
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No templates found. Create your first template!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Eye className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-2">
                  Size: {template.canvasSize}
                </p>
                <p className="text-gray-600 mb-4">
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/edit-form/${template.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <Link
                    to={`/add-content/${template.id}`}
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Content
                  </Link>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTemplates;