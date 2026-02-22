const express = require('express');
const router = express.Router();
const {
  getQuestions,
  checkAccess,
  createQuestion,
  bulkCreateQuestions,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', protect, getQuestions);
router.get('/check-access/:chapterId', protect, checkAccess);
router.post('/', protect, adminOnly, createQuestion);
router.post('/bulk', protect, adminOnly, bulkCreateQuestions);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;