import React from 'react';

// Base shimmer animation block
const ShimmerBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// A single card skeleton (used for Subscription Plans, Subject cards)
export const CardShimmer = () => (
  <div className="card animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-8 bg-gray-200 rounded w-2/3 mb-6" />
    <div className="space-y-3 mb-6">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-3 bg-gray-200 rounded w-4/6" />
    </div>
    <div className="h-10 bg-gray-200 rounded-lg w-full" />
  </div>
);

// Grid of card shimmers
export const CardGridShimmer = ({ count = 3, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) => (
  <div className={`grid ${columns} gap-8`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardShimmer key={i} />
    ))}
  </div>
);

// A single list-row skeleton (used for Chapters, Questions)
export const ListItemShimmer = () => (
  <div className="card animate-pulse flex items-center gap-4">
    <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="w-6 h-6 bg-gray-200 rounded" />
  </div>
);

// Stack of list item shimmers
export const ListShimmer = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <ListItemShimmer key={i} />
    ))}
  </div>
);

// Question card shimmer (taller with options)
export const QuestionShimmer = () => (
  <div className="card animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-5 bg-gray-200 rounded" />
      <div className="w-12 h-5 bg-gray-200 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-lg" />
      ))}
    </div>
  </div>
);

// Stack of question shimmers
export const QuestionListShimmer = ({ count = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <QuestionShimmer key={i} />
    ))}
  </div>
);

// Dashboard stats shimmer (4 stat cards)
export const StatsShimmer = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="card animate-pulse flex flex-col xl:flex-row items-center gap-3 p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="space-y-2 flex-1 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto xl:mx-0" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto xl:mx-0" />
        </div>
      </div>
    ))}
  </div>
);

// Dashboard page shimmer (stats + level grid + subscription)
export const DashboardShimmer = () => (
  <div>
    <StatsShimmer />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2">
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Payment page shimmer
export const PaymentShimmer = () => (
  <div className="max-w-2xl mx-auto animate-pulse">
    <div className="card">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-8" />
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-24 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  </div>
);

export default {
  CardShimmer,
  CardGridShimmer,
  ListItemShimmer,
  ListShimmer,
  QuestionShimmer,
  QuestionListShimmer,
  StatsShimmer,
  DashboardShimmer,
  PaymentShimmer,
};
