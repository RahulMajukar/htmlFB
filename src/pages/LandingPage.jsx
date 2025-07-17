// File: src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Layout, Send } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Create Professional Forms with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build, customize, and export forms with our intuitive drag-and-drop interface
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/new-form"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Form
            </Link>
            <Link
              to="/templates"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center border border-blue-600"
            >
              <Layout className="w-5 h-5 mr-2" />
              View Templates
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Canvas Sizes</h3>
            <p className="text-gray-600">Support for A4, A3, A2, A1 and custom paper sizes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Layout className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
            <p className="text-gray-600">Intuitive interface to create forms quickly</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Send className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Export & Share</h3>
            <p className="text-gray-600">Export to PDF or send via email instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;