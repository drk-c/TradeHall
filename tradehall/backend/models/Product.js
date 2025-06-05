const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true },
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
