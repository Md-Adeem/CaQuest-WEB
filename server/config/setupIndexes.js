const mongoose = require("mongoose");
const User = require("../models/User");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");
const Payment = require("../models/Payment");
const Progress = require("../models/Progress");
const Bookmark = require("../models/Bookmark");

const setupIndexes = async () => {
  try {
    console.log("📊 Setting up database indexes...");

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ "activeSubscriptions.level": 1 });

    // Subject indexes
    await Subject.collection.createIndex({ level: 1, order: 1 });
    await Subject.collection.createIndex({ code: 1 }, { unique: true });
    await Subject.collection.createIndex(
      { name: "text", code: "text", description: "text" },
      { name: "subject_text_search" }
    );

    // Chapter indexes
    await Chapter.collection.createIndex({ subject: 1, chapterNumber: 1 });
    await Chapter.collection.createIndex({ level: 1 });
    await Chapter.collection.createIndex(
      { name: "text", description: "text" },
      { name: "chapter_text_search" }
    );

    // Question indexes
    await Question.collection.createIndex({ chapter: 1, isActive: 1 });
    await Question.collection.createIndex({ subject: 1, level: 1 });
    await Question.collection.createIndex(
      { questionText: "text", explanation: "text" },
      { name: "question_text_search" }
    );

    // Payment indexes
    await Payment.collection.createIndex({ user: 1, status: 1 });
    await Payment.collection.createIndex({ status: 1, createdAt: -1 });
    await Payment.collection.createIndex(
      { transactionId: 1 },
      { unique: true }
    );

    // Progress indexes
    await Progress.collection.createIndex(
      { user: 1, question: 1 },
      { unique: true }
    );
    await Progress.collection.createIndex({ user: 1, chapter: 1 });
    await Progress.collection.createIndex({ user: 1, subject: 1 });
    await Progress.collection.createIndex({ user: 1, level: 1, createdAt: -1 });

    // Bookmark indexes
    await Bookmark.collection.createIndex(
      { user: 1, question: 1 },
      { unique: true }
    );
    await Bookmark.collection.createIndex({ user: 1, level: 1 });
    await Bookmark.collection.createIndex({ user: 1, chapter: 1 });

    console.log("✅ Database indexes created successfully");
  } catch (error) {
    console.error("❌ Index creation error:", error.message);
  }
};

module.exports = setupIndexes;
