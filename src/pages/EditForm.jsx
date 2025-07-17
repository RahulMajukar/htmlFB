// File: src/pages/EditForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormCanvas from '../components/FormCanvas';
import ComponentPalette from '../components/ComponentPalette';
import { Save, Download, Send, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const data = await api.getForm(id);
      setForm({
        ...data,
        elements: JSON.parse(data.elements || '[]')
      });
    } catch (error) {
      console.error('Error fetching form:', error);
      alert('Failed to load form');
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const generateHtmlFromElements = (elements) => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
    `;

    elements.forEach(element => {
      switch (element.type) {
        case 'header':
          html += `<h1>${element.content}</h1>`;
          break;
        case 'text':
          html += `<p>${element.content}</p>`;
          break;
        case 'table':
          html += '<table>';
          if (element.content.headers) {
            html += '<thead><tr>';
            element.content.headers.forEach(header => {
              html += `<th>${header}</th>`;
            });
            html += '</tr></thead>';
          }
          if (element.content.rows) {
            html += '<tbody>';
            element.content.rows.forEach(row => {
              html += '<tr>';
              row.forEach(cell => {
                html += `<td>${cell}</td>`;
              });
              html += '</tr>';
            });
            html += '</tbody>';
          }
          html += '</table>';
          break;
        case 'html':
          html += element.content;
          break;
        default:
          break;
      }
    });

    html += '</body></html>';
    return html;
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: form.name,
        canvasSize: form.canvasSize,
        elements: JSON.stringify(form.elements),
        htmlContent: generateHtmlFromElements(form.elements)
      };
      
      await api.updateForm(id, updateData);
      alert('Form updated successfully!');
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Failed to update form: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdfBlob = await api.exportPDF(id);
      
      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF: ' + error.message);
    }
  };

  const handleSendEmail = async () => {
    const email = prompt('Enter recipient email:');
    if (email) {
      const subject = prompt('Enter email subject:', `Form: ${form.name}`);
      const message = prompt('Enter email message:', 'Please find the attached form.');
      
      try {
        await api.sendEmail(id, {
          recipientEmail: email,
          subject: subject || `Form: ${form.name}`,
          message: message || 'Please find the attached form.'
        });
        
        alert('Email sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!form) {
    return <div className="flex justify-center items-center h-screen">Form not found</div>;
  }

  const paperSizes = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    A2: { width: 420, height: 594 },
    A1: { width: 594, height: 841 }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <ComponentPalette />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/templates')}
                  className="mr-4 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-xl font-semibold border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <select
                value={form.canvasSize}
                onChange={(e) => setForm({ ...form, canvasSize: e.target.value })}
                className="border rounded px-3 py-1"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
              </select>
              <div className="flex space-x-2">
                <button 
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Updating...' : 'Update'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 bg-gray-200">
            <FormCanvas
              size={paperSizes[form.canvasSize]}
              elements={form.elements}
              setElements={(elements) => setForm({ ...form, elements })}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default EditForm;