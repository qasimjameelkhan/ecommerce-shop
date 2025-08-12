// seed/seedProducts.js
require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

async function seed() {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
  await Product.deleteMany({});
  const items = [
    {
      name: 'Aurora Sneakers',
      slug: 'aurora-sneakers',
      description: 'Lightweight, breathable sneakers with colorful accents.',
      price: 79.99,
      image: '/assets/sneakers-1.jpg',
      stock: 30
    },
    {
      name: 'Lumen Backpack',
      slug: 'lumen-backpack',
      description: 'Durable backpack with USB charging port and laptop sleeve.',
      price: 49.99,
      image: '/assets/backpack-1.jpg',
      stock: 20
    },
    {
      name: 'Nebula Headphones',
      slug: 'nebula-headphones',
      description: 'Wireless over-ear headphones with active noise cancellation.',
      price: 129.99,
      image: '/assets/headphones-1.jpg',
      stock: 15
    }
  ];
  await Product.insertMany(items);
  console.log('Seeded products');
  process.exit();
}
seed();
