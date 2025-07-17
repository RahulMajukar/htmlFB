import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormCanvas from '../components/FormCanvas';
import ComponentPalette from '../components/ComponentPalette';
import { Save, Download, Send, Code } from 'lucide-react';
import { api } from '../utils/api';

const NewFormBuilder = () => {
  const navigate = useNavigate();
  const [canvasSize, setCanvasSize] = useState('A4');
  const [formElements, setFormElements] = useState([]);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [formName, setFormName] = useState('New Form');
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  const paperSizes = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    A2: { width: 420, height: 594 },
    A1: { width: 594, height: 841 }
  };

  const generateHtmlFromElements = () => {
    // Generate HTML content from form elements
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
    `;

    formElements.forEach(element => {
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

  const handleSave = async () => {
    setIsSaving(true);
    const formData = {
      name: formName,
      canvasSize,
      elements: JSON.stringify(formElements),
      htmlContent: generateHtmlFromElements()
    };
    
    try {
      const response = await api.createForm(formData);
      alert('Form saved successfully!');
      navigate(`/edit-form/${response.id}`);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    // First save the form, then export
    try {
      const formData = {
        name: formName,
        canvasSize,
        elements: JSON.stringify(formElements),
        htmlContent: generateHtmlFromElements()
      };
      
      const savedForm = await api.createForm(formData);
      const pdfBlob = await api.exportPDF(savedForm.id);
      
      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formName}.pdf`;
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
      const subject = prompt('Enter email subject:', `Form: ${formName}`);
      const message = prompt('Enter email message:', 'Please find the attached form.');
      
      try {
        const formData = {
          name: formName,
          canvasSize,
          elements: JSON.stringify(formElements),
          htmlContent: generateHtmlFromElements()
        };
        
        const savedForm = await api.createForm(formData);
        await api.sendEmail(savedForm.id, {
          recipientEmail: email,
          subject: subject || `Form: ${formName}`,
          message: message || 'Please find the attached form.'
        });
        
        alert('Email sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email: ' + error.message);
      }
    }
  };

  const handlePasteHtml = () => {
    if (htmlContent) {
      const newElement = {
        id: Date.now(),
        type: 'html',
        content: htmlContent,
        position: { x: 50, y: 50 }
      };
      setFormElements([...formElements, newElement]);
      setHtmlContent('');
      setShowHtmlModal(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        {/* Left Sidebar - Component Palette */}
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <ComponentPalette />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-xl font-semibold border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                placeholder="Form Name"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <select
                  value={canvasSize}
                  onChange={(e) => setCanvasSize(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A2">A2</option>
                  <option value="A1">A1</option>
                </select>
                <button
                  onClick={() => setShowHtmlModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Paste HTML
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
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

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-8 bg-gray-200">
            <div ref={canvasRef}>
              <FormCanvas
                size={paperSizes[canvasSize]}
                elements={formElements}
                setElements={setFormElements}
              />
            </div>
          </div>
        </div>
      </div>

      {/* HTML Paste Modal */}
      {showHtmlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
            <h3 className="text-lg font-semibold mb-4">Paste HTML Content</h3>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-64 border rounded p-2 font-mono text-sm"
              placeholder="Paste your HTML here..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowHtmlModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteHtml}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default NewFormBuilder;