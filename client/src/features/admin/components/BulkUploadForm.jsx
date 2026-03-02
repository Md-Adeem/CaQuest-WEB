import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';
import subjectService from '../../subjects/services/subjectService';
import { HiUpload, HiOutlineDocumentText } from 'react-icons/hi';

const BulkUploadForm = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  
  // Selection States
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  // Fetch Subjects on Level Change
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

  // Fetch Chapters on Subject Change
  useEffect(() => {
    if (selectedSubject) {
      subjectService.getChaptersBySubject(selectedSubject).then((res) => {
        setChapters(res.data.data);
        setSelectedChapter('');
      });
    }
  }, [selectedSubject]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'text/csv' && !uploadedFile.name.endsWith('.csv')) {
        toast.error('Please upload a valid CSV file');
        return;
      }
      setFile(uploadedFile);

      // Parse Preview
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewData(results.data.slice(0, 3)); // Preview first 3 rows
        },
        error: (error) => {
          toast.error(`Error parsing file: ${error.message}`);
        }
      });
    }
  };

  const handleDownloadTemplate = () => {
    const templateCSV = "questionText,type,option1,option2,option3,option4,correctAnswer,explanation,difficulty,marks\nWhat is a journal?,subjective,,,,,,Detailed explanation,medium,5\nAssets equal Liabilities plus?,MCQ,Equity,Revenue,Expenses,Income,0,Accounting equation principle,easy,1";
    
    const blob = new Blob([templateCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "caquest_questions_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedChapter) {
      toast.error('Please select a Level, Subject, and Chapter first');
      return;
    }

    if (!file) {
      toast.error('Please upload a CSV file');
      return;
    }

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Map CSV rows to match Question Schema
          const formattedQuestions = results.data.map((row, index) => {
            const type = row.type?.toUpperCase() === 'MCQ' ? 'MCQ' : 'subjective';
            
            // Reconstruct Options Array for MCQ
            let options = [];
            let correctAnswer = 0;
            
            if (type === 'MCQ') {
              options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
              if (options.length < 2) {
                throw new Error(`Row ${index + 1}: MCQ requires at least 2 options`);
              }
              correctAnswer = parseInt(row.correctAnswer) || 0;
            }

            return {
              questionText: row.questionText,
              type,
              options: type === 'MCQ' ? options : [],
              correctAnswer: type === 'MCQ' ? correctAnswer : undefined,
              modelAnswer: type === 'subjective' ? row.correctAnswer : undefined,
              explanation: row.explanation || '',
              difficulty: row.difficulty?.toLowerCase() || 'medium',
              marks: parseInt(row.marks) || (type === 'MCQ' ? 1 : 5),
              // Ensure numerical accuracy for parsing
              paperType: row.paperType || 'Practice'
            };
          });

          // Send to API
          const payload = {
            chapterId: selectedChapter,
            questions: formattedQuestions
          };

          const response = await adminService.bulkCreateQuestions(payload);
          toast.success(`Successfully uploaded ${response.data.count} questions!`);
          
          if (onSuccess) onSuccess();
          
          // Reset
          setFile(null);
          setPreviewData([]);
          
        } catch (error) {
          toast.error(error.message || 'Error processing CSV rows.');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        toast.error(`CSV Parsing Error: ${error.message}`);
        setLoading(false);
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HiOutlineDocumentText className="text-primary-600" />
            Bulk Upload Questions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload a CSV file to add multiple questions to a chapter at once.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
        >
          Download CSV Template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Classification Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="input-field w-full"
            >
              <option value="">Select Level</option>
              <option value="foundation">CA Foundation</option>
              <option value="intermediate">CA Intermediate</option>
              <option value="final">CA Final</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field w-full"
              disabled={!selectedLevel}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="input-field w-full"
              disabled={!selectedSubject}
            >
              <option value="">Select Chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter._id} value={chapter._id}>
                  {chapter.chapterNumber}. {chapter.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center justify-center p-4"
          >
            <HiUpload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
              {file ? file.name : 'Click to upload CSV file'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Make sure to use the provided CSV template format.
            </span>
          </label>
        </div>

        {/* Data Preview */}
        {previewData.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <h4 className="font-semibold text-gray-700 mb-2">CSV Data Preview (First 3 rows)</h4>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-2">Type</th>
                  <th className="p-2">Question</th>
                  <th className="p-2">Marks</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="p-2 break-words max-w-xs">{row.type}</td>
                    <td className="p-2 truncate max-w-sm">{row.questionText}</td>
                    <td className="p-2">{row.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file || !selectedChapter}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {loading ? 'Processing & Uploading...' : 'Upload Questions'}
        </button>
      </form>
    </div>
  );
};

export default BulkUploadForm;
