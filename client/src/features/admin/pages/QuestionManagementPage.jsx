import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import QuestionUploadForm from '../components/QuestionUploadForm';
import QuestionManagement from '../components/QuestionManagement';
import { HiPlus, HiCollection } from 'react-icons/hi';

const QuestionManagementPage = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Question Management
          </h1>
          <p className="text-gray-500 mt-1">
            Upload, manage, and organize practice questions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <HiPlus className="w-4 h-4" />
            Upload Question
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'manage'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <HiCollection className="w-4 h-4" />
            Manage Questions
          </button>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === 'upload' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Upload New Question
              </h2>
              <QuestionUploadForm />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Manage Existing Questions
              </h2>
              <QuestionManagement />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementPage;