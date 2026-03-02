import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import QuestionUploadForm from '../components/QuestionUploadForm';
import BulkUploadForm from '../components/BulkUploadForm';
import QuestionManagement from '../components/QuestionManagement';
import { HiPlus, HiCollection, HiUpload } from 'react-icons/hi';

const QuestionManagementPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadMode, setUploadMode] = useState('single');

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {uploadMode === 'single' ? 'Upload New Question' : 'Bulk Upload via CSV'}
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setUploadMode('single')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      uploadMode === 'single'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setUploadMode('bulk')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      uploadMode === 'bulk'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Bulk (CSV)
                  </button>
                </div>
              </div>

              {uploadMode === 'single' ? (
                <QuestionUploadForm />
              ) : (
                <BulkUploadForm onSuccess={() => setActiveTab('manage')} />
              )}
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