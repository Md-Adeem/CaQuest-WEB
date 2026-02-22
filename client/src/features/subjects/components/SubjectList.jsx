import React from 'react';
import SubjectCard from './SubjectCard';
import EmptyState from '../../../shared/components/EmptyState';

const SubjectList = ({ subjects }) => {
  if (subjects.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No Subjects Available"
        description="Subjects for this level haven't been added yet. Check back soon!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <SubjectCard key={subject._id} subject={subject} />
      ))}
    </div>
  );
};

export default SubjectList;