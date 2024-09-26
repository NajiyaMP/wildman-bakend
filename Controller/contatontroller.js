// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const nodemailer = require('nodemailer');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// // POST route to handle the contact form submission
// app.post('/contact', (req, res) => {
//   const { name, email, subject, message } = req.body;

//   // Setup nodemailer transporter
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com', // replace with your email
//       pass: 'your-email-password' // replace with your email password
//     }
//   });

//   const mailOptions = {
//     from: email,
//     to: 'info@example.com', // your contact email
//     subject: subject,
//     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Error sending message');
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.status(200).send('Message sent successfully');
//     }
//   });
// });

// // Start the server
// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });
