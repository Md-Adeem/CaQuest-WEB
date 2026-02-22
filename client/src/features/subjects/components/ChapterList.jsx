import React from 'react';
import ChapterCard from './ChapterCard';

const ChapterList = ({ chapters }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📖</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chapters Available</h3>
        <p className="text-gray-500">Chapters for this subject haven't been added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => (
        <ChapterCard key={chapter._id} chapter={chapter} index={index} />
      ))}
    </div>
  );
};

export default ChapterList;