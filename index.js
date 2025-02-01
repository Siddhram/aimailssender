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
      
   const prompt = `You are an AI assistant tasked with drafting a professional email to a government authority regarding a case of deep fake fraud. Below is the chat history between the user and the chatbot, which outlines the user's experiences with deep fake issues related to news, images, or videos. 
User Chat History: ${user_chat}
Based on the information provided in the chat history, please generate a concise and professional email that includes the following elements:
1. A brief introduction of the user and the purpose of the email.
2. A summary of the deep fake issues faced by the user, including any specific examples mentioned in the chat.
3. A request for assistance or action from the government authority regarding this matter.
4. A polite closing statement.

The email should be clear, formal, and suitable for communication with a government official.
`;


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
