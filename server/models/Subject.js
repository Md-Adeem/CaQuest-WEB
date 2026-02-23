const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true,
    },

    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["foundation", "intermediate", "final"],
    },

    // Question type for this subject
    type: {
      type: String,
      enum: ["MCQ", "SUBJECTIVE"],
      default: "MCQ",
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalChapters: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    icon: {
      type: String,
      default: "📚",
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ level: 1, order: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
