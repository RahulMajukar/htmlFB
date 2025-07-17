// File: src/utils/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response;
};

export const api = {
  // Forms
  getForms: async () => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getForm: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  searchForms: async (name) => {
    const response = await fetch(`${API_BASE_URL}/forms/search?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  createForm: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  updateForm: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  deleteForm: async (id) => {
    const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to delete form');
    }
  },

  // Form Content
  createFormContent: async (contentData) => {
    const response = await fetch(`${API_BASE_URL}/form-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getFormContent: async (templateId) => {
    const response = await fetch(`${API_BASE_URL}/form-content/template/${templateId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  getFormContentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/form-content/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  updateFormContent: async (id, contentData) => {
    const response = await fetch(`${API_BASE_URL}/form-content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  deleteFormContent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/form-content/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to delete form content');
    }
  },

  // PDF Export
  exportPDF: async (formId) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}/export/pdf`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }
    return response.blob();
  },

  // Email
  sendEmail: async (formId, emailData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};