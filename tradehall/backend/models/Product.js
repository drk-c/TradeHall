const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  //id: { type: Number, required: true, validate: Number.isInteger },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type:[
    {
      data: Buffer,
      contentType: String
    }
  ], required: true },
  price: { type: Number, required: true },
  category: String,
  location: String,
  email: String,
  phone: String,
  sold: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
