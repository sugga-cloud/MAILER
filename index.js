import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

async function sendEmail({ host, port, secure, user, pass }, { from, to, subject, html }) {
  if (!host || !port || !user || !pass) {
    throw new Error('Missing SMTP config parameters');
  }
  if (!from || !to || !subject || !html) {
    throw new Error('Missing email details');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = { from, to, subject, html };

  return transporter.sendMail(mailOptions);
}

// POST /send-email endpoint
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

    await sendEmail(
      {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        user: smtpUser,
        pass: smtpPass,
      },
      { from, to, subject, html }
    );

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
