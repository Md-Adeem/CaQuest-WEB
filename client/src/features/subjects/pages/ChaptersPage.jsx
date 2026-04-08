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
      {/* Premium Subject Hero Header */}
      {subject && (
        <div className="mb-10 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0b0f19] border border-slate-700/60 shadow-2xl shadow-indigo-900/20 group">
          {/* Decorative ambient glows */}
          <div className="absolute w-72 h-72 -top-24 -right-12 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-400/20 transition-colors duration-700"></div>
          <div className="absolute w-96 h-96 -bottom-32 -left-20 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/10 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            {/* Embedded Breadcrumb */}
            <Link
              to={`/subjects/${subject.level}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mb-6 uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
            >
              <HiArrowLeft className="w-4 h-4" />
              Return to {LEVELS[subject.level]?.name}
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Text Area */}
              <div className="flex items-start sm:items-center gap-5">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hidden sm:block">
                  <span className="text-5xl drop-shadow-md">{subject.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] font-black text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded uppercase tracking-[0.2em]">{subject.code}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                    {subject.name}
                  </h1>
                  {subject.description && (
                    <p className="text-sm font-medium text-slate-400 max-w-2xl leading-relaxed">
                      {subject.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-5">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-white">{chapters.length}</span> Chapters
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-white">{subject.totalQuestions}</span> Questions
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Area */}
              {gptLink && (
                <div className="shrink-0 flex items-center">
                  <a 
                    href={gptLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all w-full sm:w-auto overflow-hidden relative group/btn"
                  >
                    <span className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
                    <HiSparkles className="w-5 h-5 text-yellow-300" />
                    Study with ICAI AI
                  </a>
                </div>
              )}
            </div>
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