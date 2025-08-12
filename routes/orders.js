// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    const order = new Order({
      user: userId,
      products,
      totalPrice,
      status: 'Pending'
    });

    await order.save();
    res.json({ msg: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get order by ID (✅ param name added)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
