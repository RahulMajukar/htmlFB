
// File: src/pages/AddContent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, FileText } from 'lucide-react';
import { api } from '../utils/api';

const AddContent = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingContents, setExistingContents] = useState([]);

  useEffect(() => {
    fetchTemplate();
    fetchExistingContents();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const data = await api.getForm(templateId);
      setTemplate(data);
    } catch (error) {
      console.error('Error fetching template:', error);
      alert('Failed to load template');
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingContents = async () => {
    try {
      const data = await api.getFormContent(templateId);
      setExistingContents(data);
    } catch (error) {
      console.error('Error fetching existing contents:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await api.createFormContent({
        templateId: parseInt(templateId),
        content: JSON.stringify(data)
      });
      
      alert('Content saved successfully!');
      navigate('/templates');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewContent = (contentId) => {
    // Navigate to view/edit specific content
    navigate(`/view-content/${contentId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading template...</div>;
  }

  if (!template) {
    return <div className="flex justify-center items-center h-screen">Template not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Add Content to: {template.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Fill Form Data</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Basic Information Section */}
              <div className="border-b pb-4">
                <h3 className="font-medium mb-3">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prepared By
                    </label>
                    <input
                      {...register('preparedBy', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="QQM QC"
                    />
                    {errors.preparedBy && (
                      <p className="text-red-500 text-sm mt-1">{errors.preparedBy.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approved By
                    </label>
                    <input
                      {...register('approvedBy', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="AVP-QA & SYS"
                    />
                    {errors.approvedBy && (
                      <p className="text-red-500 text-sm mt-1">{errors.approvedBy.message}</p>
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
                      Shift
                    </label>
                    <select
                      {...register('shift', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Shift</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    {errors.shift && (
                      <p className="text-red-500 text-sm mt-1">{errors.shift.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="border-b pb-4">
                <h3 className="font-medium mb-3">Product Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <input
                      {...register('product', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="100 mL Bag Pke."
                    />
                    {errors.product && (
                      <p className="text-red-500 text-sm mt-1">{errors.product.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant
                    </label>
                    <input
                      {...register('variant', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Blue matt"
                    />
                    {errors.variant && (
                      <p className="text-red-500 text-sm mt-1">{errors.variant.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <input
                      {...register('customer', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Customer name"
                    />
                    {errors.customer && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Line No.
                    </label>
                    <input
                      {...register('lineNo', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="02"
                    />
                    {errors.lineNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.lineNo.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size No.
                    </label>
                    <input
                      {...register('sizeNo', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="1"
                    />
                    {errors.sizeNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.sizeNo.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sample Size
                    </label>
                    <input
                      {...register('sampleSize', { required: 'This field is required' })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="08 Nos."
                    />
                    {errors.sampleSize && (
                      <p className="text-red-500 text-sm mt-1">{errors.sampleSize.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes/Comments
                </label>
                <textarea
                  {...register('notes')}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Contents Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Existing Form Contents</h2>
          
          {existingContents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No content added yet for this template.</p>
          ) : (
            <div className="space-y-3">
              {existingContents.map((content) => {
                const parsedContent = JSON.parse(content.content);
                return (
                  <div
                    key={content.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewContent(content.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <FileText className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="font-medium">
                            {parsedContent.product || 'Untitled'} - {parsedContent.customer || 'N/A'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Prepared by: {parsedContent.preparedBy || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date: {parsedContent.date ? new Date(parsedContent.date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(content.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContent;
