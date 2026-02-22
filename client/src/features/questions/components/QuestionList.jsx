import React from 'react';
import QuestionCard from './QuestionCard';
import EmptyState from '../../../shared/components/EmptyState';

const QuestionList = ({ questions }) => {
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
      {questions.map((question, index) => (
        <QuestionCard key={question._id} question={question} index={index} />
      ))}
    </div>
  );
};

export default QuestionList;