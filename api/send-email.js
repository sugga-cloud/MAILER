import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

  try {
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

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email sending failed' });
  }
}
