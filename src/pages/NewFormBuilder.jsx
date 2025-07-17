// File: src/pages/NewFormBuilder.js
import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormCanvas from '../components/FormCanvas';
import ComponentPalette from '../components/ComponentPalette';
import { Save, Download, Send, Code } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const NewFormBuilder = () => {
  const [canvasSize, setCanvasSize] = useState('A4');
  const [formElements, setFormElements] = useState([]);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const canvasRef = useRef(null);

  const paperSizes = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    A2: { width: 420, height: 594 },
    A1: { width: 594, height: 841 }
  };

  const handleSave = async () => {
    const formData = {
      name: 'New Form',
      canvasSize,
      elements: formElements,
      createdAt: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Form saved successfully!');
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleExportPDF = async () => {
    const canvas = await html2canvas(canvasRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvasSize === 'A1' || canvasSize === 'A2' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: canvasSize.toLowerCase()
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('form.pdf');
  };

  const handleSendEmail = async () => {
    const email = prompt('Enter recipient email:');
    if (email) {
      // Implementation for sending email with PDF
      alert(`Email would be sent to: ${email}`);
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
          <div className="bg-white shadow-sm p-4 flex justify-between items-center">
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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