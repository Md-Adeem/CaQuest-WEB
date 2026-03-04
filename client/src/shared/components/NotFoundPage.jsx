import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiArrowLeft } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-extrabold text-primary-100 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <HiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center gap-2">
            <HiHome className="w-4 h-4" />
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;