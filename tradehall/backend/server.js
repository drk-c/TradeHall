const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const verifyToken = require('./middleware/verifyToken');


const User = require('./models/User');
const app = express();

// Use CORS before routes
app.use(cors());

app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected route
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update profile
app.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    // For demo purposes, we'll send the password directly
    // In production, you'd want to send a reset link instead
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TradeHall - Your Password Recovery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">TradeHall Password Recovery</h2>
          <p>Hello <strong>${user.username}</strong>,</p>
          <p>You requested your password for your TradeHall account.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Account Details:</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Note:</strong> For security reasons, we cannot show your actual password. Please use the "Forgot Password" feature to reset it if needed.</p>
          </div>
          <p>If you didn't request this email, please ignore it.</p>
          <p>Best regards,<br>The TradeHall Team</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message from TradeHall - The campus marketplace for everything.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password recovery email sent successfully' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send password recovery email' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));