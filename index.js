const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const nodemailer = require('nodemailer');

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "siddharamsutar23@gmail.com",
    pass: "hdwg fbvj cxpo atkn", // Use Gmail app password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Define the endpoint
app.post('/user-chat', async (req, res) => {
  try {
    // Extract user_chat from the request body
    const { user_chat } = req.body;

    if (!user_chat) {
      return res.status(400).json({ error: 'user_chat is required' });
    }

    const prompt = `Generate a professional email body to a government authority regarding a case of deep fake fraud. The email content must be entirely based on the following chat history provided by the user:

User Chat History: ${user_chat}

The email body should:
1. Provide a detailed and specific explanation of the deep fake issues described in the chat history, using examples or instances mentioned by the user (e.g., manipulated images, videos, or news affecting them).
2. Include a formal request for assistance or action from the government authority to address these concerns.
3. End with a polite and professional closing statement.

Ensure the email content is entirely focused on the user_chat details, avoiding any introductory or generic statements. The email should be direct, professional, and suitable for communication with a government official.`;


    // Prepare the request body for the external API
    const requestBody = {
      prompt: prompt,
    };

    // Send the request to the external API
    const response = await axios.post('https://nohistorymodel.onrender.com/chat', requestBody);

    // Use the response data to send an email
    await transporter.sendMail({
      from: 'Atharva Patange <atharvapatange07@gmail.com>', // Sender address
      to: 'siddharamsutar23@gmail.com', // Recipient(s)
      subject: 'Report of Deep Fake Fraud Case', // Subject
      text: response.data.response, // Email content (plain text)
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
