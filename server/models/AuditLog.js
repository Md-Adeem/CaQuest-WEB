const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['login', 'register'],
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      // IP can be null/unknown
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // optional extra context
    }
  },
  { timestamps: true }
);

// Helpful index for fetching latest logs quickly
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
