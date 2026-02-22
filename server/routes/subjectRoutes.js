const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  reorderSubjects,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { cacheMiddleware } = require('../middleware/cache');


router.get('/', protect, cacheMiddleware(300), getSubjects); // Cache 5 min
router.get('/all', protect, adminOnly, getAllSubjects);
router.put('/reorder', protect, adminOnly, reorderSubjects);
router.get('/:id', protect, cacheMiddleware(300), getSubject);
router.post('/', protect, adminOnly, createSubject);
router.put('/:id', protect, adminOnly, updateSubject);
router.delete('/:id', protect, adminOnly, deleteSubject);

module.exports = router;