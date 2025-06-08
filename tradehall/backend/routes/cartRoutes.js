const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// GET user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    res.json(cart || { userId: req.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST add product to cart
router.post('/', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Could not update cart' });
  }
});

// PUT update quantity of an item
router.put('/:productId', verifyToken, async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    const item = cart.items.find(i => i.productId.toString() === req.params.productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
    }
    res.json(cart);
  } catch {
    res.status(400).json({ error: 'Failed to update cart' });
  }
});

// DELETE remove item from cart
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch {
    res.status(400).json({ error: 'Failed to delete item from cart' });
  }
});

module.exports = router;
