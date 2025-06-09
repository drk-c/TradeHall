const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Get the Product model
    const Product = require('./models/Product');
    
    try {
      // Try to find all products
      const products = await Product.find();
      console.log('Found products:', products);
      console.log('Number of products:', products.length);
      
      // Check the collection name
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      // Close the connection
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 