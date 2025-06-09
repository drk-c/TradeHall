const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/Product');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // upload destination folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/add', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, price, category, location, email, phone } = req.body;
    
    // Create image URLs from the uploaded files
    const images = req.files.map(file => `/uploads/${file.filename}`);

    // Save to MongoDB
    const newProduct = new Product({
      name: title,
      description,
      price: parseFloat(price),
      category,
      location,
      email,
      phone,
      images,
    });

    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
