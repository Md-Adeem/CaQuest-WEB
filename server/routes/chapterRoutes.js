const express = require('express');
const router = express.Router();
const {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', protect, getChapters);
router.get('/:id', protect, getChapter);
router.post('/', protect, adminOnly, createChapter);
router.put('/:id', protect, adminOnly, updateChapter);
router.delete('/:id', protect, adminOnly, deleteChapter);

module.exports = router;