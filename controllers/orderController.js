// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'Cart empty' });

  // compute total and build item snapshots
  let total = 0;
  const itemSnapshots = [];
  for (const it of items) {
    const product = await Product.findById(it.productId);
    if (!product) return res.status(400).json({ message: 'Product not found' });
    // optionally decrease stock here
    const price = product.price;
    itemSnapshots.push({
      product: product._id,
      name: product.name,
      price,
      quantity: it.quantity
    });
    total += price * it.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: itemSnapshots,
    shippingAddress,
    totalPrice: total
  });

  res.json({ order });
}

async function listUserOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product');
  res.json(orders);
}

module.exports = { createOrder, listUserOrders };
