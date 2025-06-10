const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET products by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products by category', err });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET product image
router.get('/image/:id/:index', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const image = product.images[req.params.index];
    res.contentType(image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// POST create new product
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, category, location, email, phone } = req.body;
    
    const images = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    // Save to MongoDB
    const newProduct = new Product({
      name,
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

// PUT update a product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
