import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import subjectService from "../../subjects/services/subjectService";
import { LEVELS, QUESTION_TYPES } from "../../../shared/utils/constants";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

const QuestionUploadForm = ({ onSuccess }) => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [loading, setLoading] = useState(false);

  // Question type state
  const [questionType, setQuestionType] = useState("MCQ");

  const [question, setQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    modelAnswer: "",
    paperType: "Practice",
  });

  useEffect(() => {
    if (selectedLevel) {
      subjectService.getSubjectsByLevel(selectedLevel).then((res) => {
        setSubjects(res.data.data);
        setSelectedSubject("");
        setChapters([]);
        setSelectedChapter("");
      });
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedSubject) {
      subjectService.getChaptersBySubject(selectedSubject).then((res) => {
        setChapters(res.data.data);
        setSelectedChapter("");
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
      toast.error("Please select a chapter");
      return;
    }

    // Validate only for MCQ
    if (questionType === "MCQ") {
      if (question.options.some((opt) => !opt.trim())) {
        toast.error("All options are required");
        return;
      }
    }

    // Validate Subjective
    if (questionType === "SUBJECTIVE" && !question.modelAnswer?.trim()) {
      toast.error("Model answer is required");
      return;
    }

    try {
      setLoading(true);

      await adminService.createQuestion({
        ...question,
        type: questionType,
        paperType: question.paperType,
        chapter: selectedChapter,
      });

      toast.success("Question created successfully!");

      setQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        modelAnswer: "",
        paperType: "Practice",
      });

      setQuestionType("MCQ");

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create question");
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

      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Question Type *
        </label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="input-field"
        >
          {QUESTION_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.icon} {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Question Text */}
      <div data-color-mode="light">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text *
        </label>
        <MDEditor
          value={question.questionText}
          onChange={(val) =>
            setQuestion({ ...question, questionText: val || "" })
          }
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          height={300}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: You can use the toolbar to insert tables, lists, and formatting.
        </p>
      </div>

      {/* Paper Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paper Type *
        </label>
        <select
          value={question.paperType}
          onChange={(e) =>
            setQuestion({
              ...question,
              paperType: e.target.value,
            })
          }
          className="input-field"
          required
        >
          <option value="Practice">Practice</option>
          <option value="RTP">RTP (Revision Test Papers)</option>
          <option value="MTP">MTP (Mock Test Papers)</option>
          <option value="PYQS">PYQS (Past Year Question Papers)</option>
        </select>
      </div>

      {/* Options - Only for MCQ */}
      {questionType === "MCQ" && (
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
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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

      {/* Model Answer - Only for SUBJECTIVE */}
      {questionType === "SUBJECTIVE" && (
        <div data-color-mode="light">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Answer *
          </label>
          <MDEditor
            value={question.modelAnswer || ""}
            onChange={(val) =>
              setQuestion({ ...question, modelAnswer: val || "" })
            }
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            height={250}
          />
        </div>
      )}

      {/* Explanation */}
      <div data-color-mode="light">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <MDEditor
          value={question.explanation || ""}
          onChange={(val) =>
            setQuestion({ ...question, explanation: val || "" })
          }
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          height={200}
        />
      </div>

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
