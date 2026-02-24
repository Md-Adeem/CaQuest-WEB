import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSubjects } from '../hooks/useSubjects';
import SubjectList from '../components/SubjectList';
import { CardGridShimmer } from '../../../shared/components/Shimmer';
import { LEVELS } from '../../../shared/utils/constants';
import { HiArrowLeft } from 'react-icons/hi';

const SubjectsPage = () => {
  const { level } = useParams();
  const { subjects, loading } = useSubjects(level);
  const levelInfo = LEVELS[level];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{levelInfo?.icon}</span>
          <h1 className="text-3xl font-bold text-gray-900">
            {levelInfo?.name || 'Subjects'}
          </h1>
        </div>
        <p className="text-gray-500">
          Select a subject to view chapters and practice questions
        </p>
      </div>

      {/* Subject Grid */}
      {loading ? (
        <CardGridShimmer count={6} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <SubjectList subjects={subjects} />
      )}
    </div>
  );
};

export default SubjectsPage;