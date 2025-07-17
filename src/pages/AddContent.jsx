// File: src/pages/AddContent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft } from 'lucide-react';

const AddContent = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/forms/${templateId}`);
        const data = await response.json();
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/form-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          content: data,
          createdAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        alert('Content saved successfully!');
        navigate('/templates');
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading template...</div>;
  }

  if (!template) {
    return <div className="flex justify-center items-center h-screen">Template not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Add Content to: {template.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dynamic form fields based on template structure */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prepared By
              </label>
              <input
                {...register('preparedBy', { required: 'This field is required' })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.preparedBy && (
                <p className="text-red-500 text-sm mt-1">{errors.preparedBy.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                {...register('date', { required: 'This field is required' })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <input
                {...register('product', { required: 'This field is required' })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.product && (
                <p className="text-red-500 text-sm mt-1">{errors.product.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <input
                {...register('customer', { required: 'This field is required' })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.customer && (
                <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>
              )}
            </div>

            {/* Add more fields as needed */}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContent;