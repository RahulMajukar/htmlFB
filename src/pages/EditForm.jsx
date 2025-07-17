// File: src/pages/EditForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormCanvas from '../components/FormCanvas';
import ComponentPalette from '../components/ComponentPalette';
import { Save, Download, Send } from 'lucide-react';

const EditForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch form data
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!form) {
    return <div className="flex justify-center items-center h-screen">Form not found</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <ComponentPalette />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Editing: {form.name}</h1>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Update
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 bg-gray-200">
            <FormCanvas
              size={{ width: 210, height: 297 }}
              elements={form.elements || []}
              setElements={(elements) => setForm({ ...form, elements })}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EditForm;