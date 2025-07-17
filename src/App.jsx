// File: src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NewFormBuilder from './pages/NewFormBuilder';
import EditForm from './pages/EditForm';
import ViewTemplates from './pages/ViewTemplates';
import AddContent from './pages/AddContent';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/new-form" element={<NewFormBuilder />} />
          <Route path="/edit-form/:id" element={<EditForm />} />
          <Route path="/templates" element={<ViewTemplates />} />
          <Route path="/add-content/:templateId" element={<AddContent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;