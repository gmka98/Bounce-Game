const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API endpoint to handle sending email
app.post('/send-email', (req, res) => {
  const { name, email, score } = req.body;

  // Simple email verification, you can add more complex validation logic as needed
  if (!name || !email || !score || isNaN(score)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'gmka98@gmail.com',
    subject: 'Game Winner Notification',
    text: `Congratulations! ${name} has won the game with a score of ${score}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});