const express = require('express');
const router = express.Router();
const { sendEmail, emailTemplates } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Generate beautifully formatted HTML from the existing templates
    const template = emailTemplates.contactForm(name, email, message);

    // Send email to admin (which resolves to process.env.EMAIL_USER)
    await sendEmail({
      to: process.env.EMAIL_USER || process.env.EMAIL_FROM || 'admin@caquest.com',
      subject: template.subject,
      html: template.html,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

module.exports = router;
