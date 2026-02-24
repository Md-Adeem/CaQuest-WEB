import React, { useState, useEffect } from "react";
import adminService from "../services/adminService";
import Modal from "../../../shared/components/Modal";
import { QUESTION_TYPES } from "../../../shared/utils/constants";
import toast from "react-hot-toast";

const EditQuestionModal = ({ isOpen, onClose, questionToEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState(questionToEdit?.type || "MCQ");
  
  const [question, setQuestion] = useState({
    questionText: questionToEdit?.questionText || "",
    options: questionToEdit?.options?.length ? [...questionToEdit.options] : ["", "", "", ""],
    correctAnswer: questionToEdit?.correctAnswer ?? 0,
    explanation: questionToEdit?.explanation || "",
    modelAnswer: questionToEdit?.modelAnswer || "",
    paperType: questionToEdit?.paperType || "Practice",
  });

  useEffect(() => {
    if (questionToEdit) {
      setQuestionType(questionToEdit.type || "MCQ");
      setQuestion({
        questionText: questionToEdit.questionText || "",
        options: questionToEdit.options?.length ? [...questionToEdit.options] : ["", "", "", ""],
        correctAnswer: questionToEdit.correctAnswer ?? 0,
        explanation: questionToEdit.explanation || "",
        modelAnswer: questionToEdit.modelAnswer || "",
        paperType: questionToEdit.paperType || "Practice",
      });
    }
  }, [questionToEdit]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      await adminService.updateQuestion(questionToEdit._id, {
        ...question,
        type: questionType,
      });

      toast.success("Question updated successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Question"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Paper Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paper Type *
          </label>
          <select
            value={question.paperType}
            onChange={(e) =>
              setQuestion({ ...question, paperType: e.target.value })
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
            className="input-field h-32 resize-none"
            placeholder="Enter question text..."
            required
          />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Answer *
            </label>
            <textarea
              value={question.modelAnswer || ""}
              onChange={(e) =>
                setQuestion({ ...question, modelAnswer: e.target.value })
              }
              className="input-field h-28 resize-none"
              placeholder="Enter the expected answer..."
              required
            />
          </div>
        )}

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
            placeholder="Add explanation for the correct answer..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditQuestionModal;
