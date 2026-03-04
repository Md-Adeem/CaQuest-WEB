import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChapters } from '../hooks/useSubjects';
import ChapterList from '../components/ChapterList';
import { ListShimmer } from '../../../shared/components/Shimmer';
import { LEVELS } from '../../../shared/utils/constants';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';

const ChaptersPage = () => {
  const { subjectId } = useParams();
  const { chapters, subject, loading } = useChapters(subjectId);

  // Dynamic ICAI Custom GPT Matcher
  const getGptLink = (subjectName) => {
    if (!subjectName) return null;
    const nameStr = subjectName.toLowerCase();
    
    if (nameStr.includes('accounting')) {
      return 'https://chatgpt.com/g/g-ay1DYx2eb-accounting';
    } else if (nameStr.includes('laws')) {
      return 'https://chatgpt.com/g/g-VgikKXXLZ-business-laws';
    } else if (nameStr.includes('quantitative aptitude')) {
      return 'https://chatgpt.com/g/g-4oCJ0vUnY-quantitative-aptitude';
    } else if (nameStr.includes('economics')) {
      return 'https://chatgpt.com/g/g-zCFJIFrSu-business-economics';
    }
    return null;
  };

  const gptLink = subject ? getGptLink(subject.name) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      {subject && (
        <Link
          to={`/subjects/${subject.level}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to {LEVELS[subject.level]?.name} Subjects
        </Link>
      )}

      {/* Header */}
      {subject && (
        <div className="mb-8">
          <div className="flex items-center gap-2 text-lg font-bold text-primary-600 mb-2">
            <span className="text-2xl">{subject.icon}</span>
            <span className="font-mono uppercase px-2 py-0.5 bg-primary-50 border border-primary-100 rounded-md tracking-wider">{subject.code}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subject.name}</h1>
          {subject.description && (
            <p className="text-gray-500 dark:text-gray-400 mt-2">{subject.description}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {chapters.length} Chapters
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subject.totalQuestions} Total Questions
              </span>
            </div>
            
            {/* Custom ICAI GPT Integration */}
            {gptLink && (
              <a 
                href={gptLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all sm:w-auto w-full"
              >
                <HiSparkles className="w-4 h-4 text-yellow-300" />
                Study with ICAI AI Tutor
              </a>
            )}
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