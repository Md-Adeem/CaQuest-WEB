import React from 'react';

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;