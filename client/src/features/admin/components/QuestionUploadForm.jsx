// import React, { useState, useEffect } from 'react';
// import adminService from '../services/adminService';
// import subjectService from '../../subjects/services/subjectService';
// import { LEVELS, DIFFICULTY_LEVELS } from '../../../shared/utils/constants';
// import toast from 'react-hot-toast';
// import { HiPlus, HiTrash } from 'react-icons/hi';

// const QuestionUploadForm = ({ onSuccess }) => {
//   const [subjects, setSubjects] = useState([]);
//   const [chapters, setChapters] = useState([]);
//   const [selectedLevel, setSelectedLevel] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedChapter, setSelectedChapter] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [question, setQuestion] = useState({
//     questionText: '',
//     options: ['', '', '', ''],
//     correctAnswer: 0,
//     explanation: '',
//     difficulty: 'medium',
//     marks: 1,
//   });

//   useEffect(() => {
//     if (selectedLevel) {
//       subjectService.getSubjectsByLevel(selectedLevel).then((res) => {
//         setSubjects(res.data.data);
//         setSelectedSubject('');
//         setChapters([]);
//         setSelectedChapter('');
//       });
//     }
//   }, [selectedLevel]);

//   useEffect(() => {
//     if (selectedSubject) {
//       subjectService.getChaptersBySubject(selectedSubject).then((res) => {
//         setChapters(res.data.data);
//         setSelectedChapter('');
//       });
//     }
//   }, [selectedSubject]);

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...question.options];
//     newOptions[index] = value;
//     setQuestion({ ...question, options: newOptions });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedChapter) {
//       toast.error('Please select a chapter');
//       return;
//     }

//     if (question.options.some((opt) => !opt.trim())) {
//       toast.error('All options are required');
//       return;
//     }

//     try {
//       setLoading(true);
//       await adminService.createQuestion({
//         ...question,
//         chapter: selectedChapter,
//       });
//       toast.success('Question created successfully!');

//       // Reset form
//       setQuestion({
//         questionText: '',
//         options: ['', '', '', ''],
//         correctAnswer: 0,
//         explanation: '',
//         difficulty: 'medium',
//         marks: 1,
//       });

//       if (onSuccess) onSuccess();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create question');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Level, Subject, Chapter Selection */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Level *
//           </label>
//           <select
//             value={selectedLevel}
//             onChange={(e) => setSelectedLevel(e.target.value)}
//             className="input-field"
//             required
//           >
//             <option value="">Select Level</option>
//             {Object.values(LEVELS).map((level) => (
//               <option key={level.id} value={level.id}>
//                 {level.icon} {level.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Subject *
//           </label>
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="input-field"
//             required
//             disabled={!selectedLevel}
//           >
//             <option value="">Select Subject</option>
//             {subjects.map((sub) => (
//               <option key={sub._id} value={sub._id}>
//                 {sub.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Chapter *
//           </label>
//           <select
//             value={selectedChapter}
//             onChange={(e) => setSelectedChapter(e.target.value)}
//             className="input-field"
//             required
//             disabled={!selectedSubject}
//           >
//             <option value="">Select Chapter</option>
//             {chapters.map((ch) => (
//               <option key={ch._id} value={ch._id}>
//                 Ch {ch.chapterNumber}: {ch.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Question Text */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Question Text *
//         </label>
//         <textarea
//           value={question.questionText}
//           onChange={(e) =>
//             setQuestion({ ...question, questionText: e.target.value })
//           }
//           className="input-field h-28 resize-none"
//           placeholder="Enter the question..."
//           required
//         />
//       </div>

//       {/* Options */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Options *
//         </label>
//         <div className="space-y-3">
//           {question.options.map((option, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <label
//                 className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold cursor-pointer transition-all ${
//                   question.correctAnswer === index
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                 }`}
//                 title="Click to set as correct answer"
//               >
//                 <input
//                   type="radio"
//                   name="correctAnswer"
//                   checked={question.correctAnswer === index}
//                   onChange={() =>
//                     setQuestion({ ...question, correctAnswer: index })
//                   }
//                   className="sr-only"
//                 />
//                 {String.fromCharCode(65 + index)}
//               </label>
//               <input
//                 type="text"
//                 value={option}
//                 onChange={(e) => handleOptionChange(index, e.target.value)}
//                 className="input-field flex-1"
//                 placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                 required
//               />
//             </div>
//           ))}
//           <p className="text-xs text-gray-500">
//             Click the letter button to mark the correct answer (currently:{' '}
//             <span className="font-bold text-green-600">
//               {String.fromCharCode(65 + question.correctAnswer)}
//             </span>
//             )
//           </p>
//         </div>
//       </div>

//       {/* Difficulty & Marks */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Difficulty
//           </label>
//           <select
//             value={question.difficulty}
//             onChange={(e) =>
//               setQuestion({ ...question, difficulty: e.target.value })
//             }
//             className="input-field"
//           >
//             {DIFFICULTY_LEVELS.map((diff) => (
//               <option key={diff.id} value={diff.id}>
//                 {diff.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Marks
//           </label>
//           <input
//             type="number"
//             value={question.marks}
//             onChange={(e) =>
//               setQuestion({ ...question, marks: parseInt(e.target.value) || 1 })
//             }
//             className="input-field"
//             min="1"
//             max="10"
//           />
//         </div>
//       </div>

//       {/* Explanation */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Explanation (Optional)
//         </label>
//         <textarea
//           value={question.explanation}
//           onChange={(e) =>
//             setQuestion({ ...question, explanation: e.target.value })
//           }
//           className="input-field h-24 resize-none"
//           placeholder="Add explanation for the correct answer..."
//         />
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="btn-primary flex items-center gap-2"
//       >
//         {loading ? (
//           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//         ) : (
//           <>
//             <HiPlus className="w-5 h-5" />
//             Add Question
//           </>
//         )}
//       </button>
//     </form>
//   );
// };

// export default QuestionUploadForm;

import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import subjectService from '../../subjects/services/subjectService';
import { LEVELS, DIFFICULTY_LEVELS } from '../../../shared/utils/constants';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi';

const QuestionUploadForm = ({ onSuccess }) => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ 1️⃣ ADDED QUESTION TYPE STATE
  const [questionType, setQuestionType] = useState('MCQ');

  const [question, setQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    marks: 1,
    modelAnswer: '',
  });

  useEffect(() => {
    if (selectedLevel) {
      subjectService.getSubjectsByLevel(selectedLevel).then((res) => {
        setSubjects(res.data.data);
        setSelectedSubject('');
        setChapters([]);
        setSelectedChapter('');
      });
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedSubject) {
      subjectService.getChaptersBySubject(selectedSubject).then((res) => {
        setChapters(res.data.data);
        setSelectedChapter('');
      });
    }
  }, [selectedSubject]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedChapter) {
      toast.error('Please select a chapter');
      return;
    }

    // ✅ Validate only for MCQ
    if (questionType === 'MCQ') {
      if (question.options.some((opt) => !opt.trim())) {
        toast.error('All options are required');
        return;
      }
    }

    // ✅ Validate Subjective
    if (questionType === 'SUBJECTIVE' && !question.modelAnswer?.trim()) {
      toast.error('Model answer is required');
      return;
    }

    try {
      setLoading(true);

      // ✅ 5️⃣ UPDATED SUBMIT PAYLOAD
      await adminService.createQuestion({
        ...question,
        type: questionType,
        chapter: selectedChapter,
      });

      toast.success('Question created successfully!');

      setQuestion({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'medium',
        marks: 1,
        modelAnswer: '',
      });

      setQuestionType('MCQ');

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Level, Subject, Chapter Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level *
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Level</option>
            {Object.values(LEVELS).map((level) => (
              <option key={level.id} value={level.id}>
                {level.icon} {level.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field"
            required
            disabled={!selectedLevel}
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chapter *
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="input-field"
            required
            disabled={!selectedSubject}
          >
            <option value="">Select Chapter</option>
            {chapters.map((ch) => (
              <option key={ch._id} value={ch._id}>
                Ch {ch.chapterNumber}: {ch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ 2️⃣ QUESTION TYPE DROPDOWN */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Question Type *
        </label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="input-field"
        >
          <option value="MCQ">Objective (MCQ)</option>
          <option value="SUBJECTIVE">Subjective</option>
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text *
        </label>
        <textarea
          value={question.questionText}
          onChange={(e) =>
            setQuestion({ ...question, questionText: e.target.value })
          }
          className="input-field h-28 resize-none"
          required
        />
      </div>

      {/* ✅ 3️⃣ WRAPPED OPTIONS SECTION */}
      {questionType === 'MCQ' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options *
          </label>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <label
                  className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold cursor-pointer transition-all ${
                    question.correctAnswer === index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={question.correctAnswer === index}
                    onChange={() =>
                      setQuestion({ ...question, correctAnswer: index })
                    }
                    className="sr-only"
                  />
                  {String.fromCharCode(65 + index)}
                </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="input-field flex-1"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty & Marks */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={question.difficulty}
            onChange={(e) =>
              setQuestion({ ...question, difficulty: e.target.value })
            }
            className="input-field"
          >
            {DIFFICULTY_LEVELS.map((diff) => (
              <option key={diff.id} value={diff.id}>
                {diff.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marks
          </label>
          <input
            type="number"
            value={question.marks}
            onChange={(e) =>
              setQuestion({ ...question, marks: parseInt(e.target.value) || 1 })
            }
            className="input-field"
            min="1"
            max="10"
          />
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) =>
            setQuestion({ ...question, explanation: e.target.value })
          }
          className="input-field h-24 resize-none"
        />
      </div>

      {/* ✅ 4️⃣ SUBJECTIVE MODEL ANSWER */}
      {questionType === 'SUBJECTIVE' && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Model Answer *
          </label>
          <textarea
            value={question.modelAnswer || ''}
            onChange={(e) =>
              setQuestion({ ...question, modelAnswer: e.target.value })
            }
            className="input-field h-28"
            required
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <HiPlus className="w-5 h-5" />
            Add Question
          </>
        )}
      </button>
    </form>
  );
};

export default QuestionUploadForm;
