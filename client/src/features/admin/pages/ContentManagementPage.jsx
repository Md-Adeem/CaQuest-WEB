import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../../../shared/components/Modal';
import Loader from '../../../shared/components/Loader';
import Badge from '../../../shared/components/Badge';
import adminService from '../services/adminService';
import subjectService from '../../subjects/services/subjectService';
import { LEVELS } from '../../../shared/utils/constants';
import toast from 'react-hot-toast';
import {
  HiPlus, HiPencil, HiTrash, HiBookOpen,
  HiCollection, HiChevronDown, HiChevronRight,
} from 'react-icons/hi';

const ContentManagementPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('foundation');
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [subjectModal, setSubjectModal] = useState({
    open: false,
    mode: 'create',
    data: null,
  });
  const [chapterModal, setChapterModal] = useState({
    open: false,
    mode: 'create',
    data: null,
    subjectId: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: null,
    id: null,
    name: '',
  });

  // Form states
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    level: 'foundation',
    description: '',
    icon: '📚',
    order: '',
  });
  const [chapterForm, setChapterForm] = useState({
    name: '',
    chapterNumber: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getSubjectsByLevel(selectedLevel);
      setSubjects(response.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    setExpandedSubject(null);
    setChapters({});
  }, [selectedLevel]);

  // Fetch chapters for a subject
  const fetchChapters = async (subjectId) => {
    try {
      const response = await subjectService.getChaptersBySubject(subjectId);
      setChapters((prev) => ({
        ...prev,
        [subjectId]: response.data.data,
      }));
    } catch (err) {
      toast.error('Failed to load chapters');
    }
  };

  const toggleSubjectExpand = (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjectId);
      if (!chapters[subjectId]) {
        fetchChapters(subjectId);
      }
    }
  };

  // ===== Subject CRUD =====
  const openCreateSubject = () => {
    setSubjectForm({
      name: '',
      code: '',
      level: selectedLevel,
      description: '',
      icon: '📚',
      order: '',
    });
    setSubjectModal({ open: true, mode: 'create', data: null });
  };

  const openEditSubject = (subject) => {
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      level: subject.level,
      description: subject.description || '',
      icon: subject.icon || '📚',
      order: subject.order || '',
    });
    setSubjectModal({ open: true, mode: 'edit', data: subject });
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (subjectModal.mode === 'create') {
        await adminService.createSubject(subjectForm);
        toast.success('Subject created successfully!');
      } else {
        await adminService.updateSubject(subjectModal.data._id, subjectForm);
        toast.success('Subject updated successfully!');
      }
      setSubjectModal({ open: false, mode: 'create', data: null });
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Chapter CRUD =====
  const openCreateChapter = (subjectId) => {
    const subjectChapters = chapters[subjectId] || [];
    const nextNumber = subjectChapters.length > 0
      ? Math.max(...subjectChapters.map((c) => c.chapterNumber)) + 1
      : 1;

    setChapterForm({
      name: '',
      chapterNumber: nextNumber,
      description: '',
    });
    setChapterModal({
      open: true,
      mode: 'create',
      data: null,
      subjectId,
    });
  };

  const openEditChapter = (chapter) => {
    setChapterForm({
      name: chapter.name,
      chapterNumber: chapter.chapterNumber,
      description: chapter.description || '',
    });
    setChapterModal({
      open: true,
      mode: 'edit',
      data: chapter,
      subjectId: chapter.subject?._id || chapter.subject,
    });
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (chapterModal.mode === 'create') {
        await adminService.createChapter({
          ...chapterForm,
          subject: chapterModal.subjectId,
        });
        toast.success('Chapter created successfully!');
      } else {
        await adminService.updateChapter(chapterModal.data._id, chapterForm);
        toast.success('Chapter updated successfully!');
      }
      setChapterModal({ open: false, mode: 'create', data: null, subjectId: null });
      fetchChapters(chapterModal.subjectId);
      fetchSubjects(); // refresh chapter counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Delete =====
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      if (deleteModal.type === 'subject') {
        await adminService.deleteSubject(deleteModal.id);
        toast.success('Subject deleted');
        fetchSubjects();
      } else {
        await adminService.deleteChapter(deleteModal.id);
        toast.success('Chapter deleted');
        // Find which subject this chapter belongs to
        for (const [subId, chs] of Object.entries(chapters)) {
          if (chs.some((c) => c._id === deleteModal.id)) {
            fetchChapters(subId);
            break;
          }
        }
        fetchSubjects();
      }
      setDeleteModal({ open: false, type: null, id: null, name: '' });
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setSubmitting(false);
    }
  };

  const iconOptions = ['📚', '📊', '⚖️', '🔢', '💹', '📈', '🏛️', '💰', '🧾', '📝', '🎯', '🏆', '💡', '🔬', '📐', '🌐', '💼', '📋'];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Content Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage subjects, chapters, and organize your content
            </p>
          </div>
          <button onClick={openCreateSubject} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add Subject
          </button>
        </div>

        {/* Level Tabs */}
        <div className="flex gap-2 mb-8">
          {Object.values(LEVELS).map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedLevel === level.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{level.icon}</span>
              {level.name}
            </button>
          ))}
        </div>

        {/* Subjects List */}
        {loading ? (
          <Loader size="lg" text="Loading content..." />
        ) : subjects.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Subjects Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding subjects for {LEVELS[selectedLevel]?.name}
            </p>
            <button onClick={openCreateSubject} className="btn-primary">
              Add First Subject
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="card !p-0 overflow-hidden"
              >
                {/* Subject Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSubjectExpand(subject._id)}
                >
                  <div className="flex items-center gap-4">
                    {expandedSubject === subject._id ? (
                      <HiChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <HiChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {subject.name}
                        </h3>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {subject.code}
                        </span>
                      </div>
                      {subject.description && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {subject.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <HiBookOpen className="w-4 h-4" />
                        {subject.totalChapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <HiCollection className="w-4 h-4" />
                        {subject.totalQuestions} questions
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditSubject(subject)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Subject"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            type: 'subject',
                            id: subject._id,
                            name: subject.name,
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Subject"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Chapters */}
                {expandedSubject === subject._id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Chapters
                      </h4>
                      <button
                        onClick={() => openCreateChapter(subject._id)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                      >
                        <HiPlus className="w-4 h-4" />
                        Add Chapter
                      </button>
                    </div>

                    {!chapters[subject._id] ? (
                      <Loader text="Loading chapters..." />
                    ) : chapters[subject._id].length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        No chapters yet.{' '}
                        <button
                          onClick={() => openCreateChapter(subject._id)}
                          className="text-primary-600 font-semibold"
                        >
                          Add the first one
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters[subject._id].map((chapter) => (
                          <div
                            key={chapter._id}
                            className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                                {chapter.chapterNumber}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {chapter.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {chapter.totalQuestions} questions
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditChapter(chapter)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <HiPencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    type: 'chapter',
                                    id: chapter._id,
                                    name: chapter.name,
                                  })
                                }
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Subject Modal */}
        <Modal
          isOpen={subjectModal.open}
          onClose={() => setSubjectModal({ open: false, mode: 'create', data: null })}
          title={subjectModal.mode === 'create' ? 'Add New Subject' : 'Edit Subject'}
          size="md"
        >
          <form onSubmit={handleSubjectSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., Principles of Accounting"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="input-field font-mono"
                  placeholder="e.g., FOUND-P1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={subjectForm.level}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, level: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  {Object.values(LEVELS).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.icon} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={subjectForm.description}
                onChange={(e) =>
                  setSubjectForm({ ...subjectForm, description: e.target.value })
                }
                className="input-field h-20 resize-none"
                placeholder="Brief description of the subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() =>
                      setSubjectForm({ ...subjectForm, icon })
                    }
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      subjectForm.icon === icon
                        ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setSubjectModal({ open: false, mode: 'create', data: null })
                }
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting
                  ? 'Saving...'
                  : subjectModal.mode === 'create'
                  ? 'Create Subject'
                  : 'Update Subject'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Chapter Modal */}
        <Modal
          isOpen={chapterModal.open}
          onClose={() =>
            setChapterModal({ open: false, mode: 'create', data: null, subjectId: null })
          }
          title={chapterModal.mode === 'create' ? 'Add New Chapter' : 'Edit Chapter'}
          size="md"
        >
          <form onSubmit={handleChapterSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter # *
                </label>
                <input
                  type="number"
                  value={chapterForm.chapterNumber}
                  onChange={(e) =>
                    setChapterForm({
                      ...chapterForm,
                      chapterNumber: parseInt(e.target.value) || '',
                    })
                  }
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  value={chapterForm.name}
                  onChange={(e) =>
                    setChapterForm({ ...chapterForm, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., Introduction to Accounting"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={chapterForm.description}
                onChange={(e) =>
                  setChapterForm({ ...chapterForm, description: e.target.value })
                }
                className="input-field h-20 resize-none"
                placeholder="Brief description of the chapter..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setChapterModal({
                    open: false,
                    mode: 'create',
                    data: null,
                    subjectId: null,
                  })
                }
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting
                  ? 'Saving...'
                  : chapterModal.mode === 'create'
                  ? 'Create Chapter'
                  : 'Update Chapter'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() =>
            setDeleteModal({ open: false, type: null, id: null, name: '' })
          }
          title={`Delete ${deleteModal.type === 'subject' ? 'Subject' : 'Chapter'}`}
          size="sm"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This will deactivate{' '}
                <strong>"{deleteModal.name}"</strong>
                {deleteModal.type === 'subject' && (
                  <> and all its chapters and questions</>
                )}
                {deleteModal.type === 'chapter' && (
                  <> and all its questions</>
                )}
                .
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, type: null, id: null, name: '' })
                }
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="btn-danger text-sm"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ContentManagementPage;