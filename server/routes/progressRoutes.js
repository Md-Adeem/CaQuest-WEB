const express = require("express");
const router = express.Router();
const {
  saveAttempt,
  saveQuizResults,
  getMyStats,
  getChapterProgress,
  toggleBookmark,
  getBookmarks,
  checkBookmarks,
  checkSingleBookmark,
} = require("../controllers/progressController");
const { protect } = require("../middleware/auth");

router.use(protect);

// Progress
router.post("/attempt", saveAttempt);
router.post("/quiz", saveQuizResults);
router.get("/stats", getMyStats);
router.get("/chapter/:chapterId", getChapterProgress);

// Bookmarks
router.post("/bookmark", toggleBookmark);
router.get("/bookmarks", getBookmarks);
router.get("/bookmarks/check/:chapterId", checkBookmarks);
router.get("/bookmarks/check-question/:questionId", checkSingleBookmark);

module.exports = router;
