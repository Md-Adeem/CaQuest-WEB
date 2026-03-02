import React from 'react';
import QuestionCard from './QuestionCard';
import EmptyState from '../../../shared/components/EmptyState';

const QuestionList = ({ questions, currentPage = 1 }) => {
  if (questions.length === 0) {
    return (
      <EmptyState
        icon="❓"
        title="No Questions Available"
        description="Questions for this chapter haven't been uploaded yet. Check back soon!"
      />
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        // Calculate the continuous question number across pages (assuming 20 items per page limit)
        const globalIndex = (currentPage - 1) * 20 + index;
        return (
          <QuestionCard key={question._id} question={question} index={globalIndex} />
        );
      })}
    </div>
  );
};

export default QuestionList;