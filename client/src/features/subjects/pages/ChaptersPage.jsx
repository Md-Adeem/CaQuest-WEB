import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChapters } from '../hooks/useSubjects';
import ChapterList from '../components/ChapterList';
import { ListShimmer } from '../../../shared/components/Shimmer';
import { LEVELS } from '../../../shared/utils/constants';
import { HiArrowLeft } from 'react-icons/hi';

const ChaptersPage = () => {
  const { subjectId } = useParams();
  const { chapters, subject, loading } = useChapters(subjectId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      {subject && (
        <Link
          to={`/subjects/${subject.level}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to {LEVELS[subject.level]?.name} Subjects
        </Link>
      )}

      {/* Header */}
      {subject && (
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-primary-600 mb-1">
            <span>{subject.icon}</span>
            <span className="font-mono uppercase">{subject.code}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
          {subject.description && (
            <p className="text-gray-500 mt-2">{subject.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-500">
              {chapters.length} Chapters
            </span>
            <span className="text-sm text-gray-500">
              {subject.totalQuestions} Total Questions
            </span>
          </div>
        </div>
      )}

      {/* Chapter List */}
      {loading ? (
        <ListShimmer count={6} />
      ) : (
        <ChapterList chapters={chapters} />
      )}
    </div>
  );
};

export default ChaptersPage;