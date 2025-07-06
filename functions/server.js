const express = require('express');
const serverless = require('@netlify/express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const handler = serverless(app);

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// Health check - GET
app.get('/send-email', (req, res) => {
  res.status(200).json({
    message: 'Email API is live. Use POST method to send emails.',
  });
});

// Send Email - POST
app.post('/send-email', async (req, res) => {
  try {
    const {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPass,
      from,
      to,
      subject,
      html,
    } = req.body;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !from || !to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({ from, to, subject, html });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Export Netlify function
module.exports.handler = handler;
