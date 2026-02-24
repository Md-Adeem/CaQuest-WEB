import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import subjectService from "../../subjects/services/subjectService";
import Badge from "../../../shared/components/Badge";
import Loader from "../../../shared/components/Loader";
import Modal from "../../../shared/components/Modal";
import { LEVELS, QUESTION_TYPES } from "../../../shared/utils/constants";
import { HiPencil, HiTrash, HiSearch, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import EditQuestionModal from "./EditQuestionModal";

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, question: null });

  useEffect(() => {
    if (selectedLevel) {
      subjectService.getSubjectsByLevel(selectedLevel).then((res) => {
        setSubjects(res.data.data);
      });
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedSubject) {
      subjectService.getChaptersBySubject(selectedSubject).then((res) => {
        setChapters(res.data.data);
      });
    }
  }, [selectedSubject]);

  const fetchQuestions = async () => {
    if (!selectedChapter) return;
    try {
      setLoading(true);
      const response = await adminService.getQuestions({
        chapter: selectedChapter,
        limit: 50,
      });
      setQuestions(response.data.data);
    } catch (err) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChapter) {
      fetchQuestions();
    }
  }, [selectedChapter]);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteQuestion(id);
      toast.success("Question deleted");
      setDeleteModal({ open: false, id: null });
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  const difficultyVariant = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedLevel}
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            setSelectedSubject("");
            setSelectedChapter("");
            setQuestions([]);
          }}
          className="input-field"
        >
          <option value="">Select Level</option>
          {Object.values(LEVELS).map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedChapter("");
            setQuestions([]);
          }}
          className="input-field"
          disabled={!selectedLevel}
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="input-field"
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

      {/* Questions List */}
      {loading ? (
        <Loader text="Loading questions..." />
      ) : questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-gray-50 rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400">
                    Q{index + 1}
                  </span>
                  <Badge variant={q.type === 'SUBJECTIVE' ? 'secondary' : 'primary'} size="sm">
                    {q.type || 'MCQ'}
                  </Badge>
                  {q.paperType && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                      {q.paperType}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {q.questionText}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.type === 'SUBJECTIVE' ? (
                    <div className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-2 rounded mt-2 w-full">
                      <strong className="block mb-1">Model Answer:</strong>
                      <span className="whitespace-pre-wrap">{q.modelAnswer}</span>
                    </div>
                  ) : (
                    q.options?.map((opt, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded ${
                          i === q.correctAnswer
                            ? "bg-green-100 text-green-700 font-bold"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}: {opt}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditModal({ open: true, question: q })}
                  className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Question"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: q._id })}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Question"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : selectedChapter ? (
        <div className="text-center py-8 text-gray-500">
          No questions found for this chapter.
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Select a level, subject, and chapter to view questions.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Question"
        size="sm"
      >
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete this question? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setDeleteModal({ open: false, id: null })}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteModal.id)}
            className="btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Edit Question Modal */}
      {editModal.open && editModal.question && (
        <EditQuestionModal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, question: null })}
          questionToEdit={editModal.question}
          onSuccess={() => {
            setEditModal({ open: false, question: null });
            fetchQuestions();
          }}
        />
      )}
    </div>
  );
};

export default QuestionManagement;
