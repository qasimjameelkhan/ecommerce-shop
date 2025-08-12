// controllers/productController.js
const Product = require('../models/Product');

async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

async function getProductBySlug(req, res) {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

module.exports = { listProducts, getProductBySlug };
