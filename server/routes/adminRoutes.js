const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPayments,
  approvePayment,
  rejectPayment,
  getUsers,
} = require('../controllers/adminController');
const { getAuditLogs } = require('../controllers/auditController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/payments', getPayments);
router.put('/payments/:id/approve', approvePayment);
router.put('/payments/:id/reject', rejectPayment);
router.get('/users', getUsers);
router.get('/audit-logs', getAuditLogs);

module.exports = router;