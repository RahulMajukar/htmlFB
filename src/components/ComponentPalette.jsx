// File: src/components/ComponentPalette.js
import React from 'react';
import { useDrag } from 'react-dnd';
import { Type, TextCursor, Table, Heading, FileText, Image } from 'lucide-react';

const DraggableComponent = ({ type, icon: Icon, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 mb-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="w-5 h-5 mr-2 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  const components = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'header', icon: Heading, label: 'Header' },
    { type: 'input', icon: TextCursor, label: 'Input Field' },
    { type: 'table', icon: Table, label: 'Table' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'section', icon: FileText, label: 'Section' }
  ];

  return (
    <div>
      {components.map((component) => (
        <DraggableComponent
          key={component.type}
          type={component.type}
          icon={component.icon}
          label={component.label}
        />
      ))}
    </div>
  );
};

export default ComponentPalette;

// File: src/utils/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Forms
  getForms: async () => {
    const response = await fetch(`${API_BASE_URL}/forms`);
    if (!response.ok) throw new Error('Failed to fetch forms');
    return response.json();
  },

  getForm: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch form');
    return response.json();
  },

  createForm: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error('Failed to create form');
    return response.json();
  },

  updateForm: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error('Failed to update form');
    return response.json();
  },

  deleteForm: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete form');
  },

  // Form Content
  createFormContent: async (contentData) => {
    const response = await fetch(`${API_BASE_URL}/form-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData)
    });
    if (!response.ok) throw new Error('Failed to create form content');
    return response.json();
  },

  getFormContent: async (templateId) => {
    const response = await fetch(`${API_BASE_URL}/form-content/template/${templateId}`);
    if (!response.ok) throw new Error('Failed to fetch form content');
    return response.json();
  },

  // PDF Export
  exportPDF: async (formId) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}/export/pdf`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to export PDF');
    return response.blob();
  },

  // Email
  sendEmail: async (formId, emailData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    if (!response.ok) throw new Error('Failed to send email');
    return response.json();
  }
};