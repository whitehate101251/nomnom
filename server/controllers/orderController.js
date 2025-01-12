const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    // Verify products and calculate totals
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      const selectedSize = product.size.find(s => 
        s.value === item.size.value && s.unit === item.size.unit
      );

      if (!selectedSize) {
        return res.status(400).json({ message: `Invalid size for product ${product.name}` });
      }

      if (selectedSize.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}`
        });
      }

      subtotal += selectedSize.price * item.quantity;
      orderItems.push({
        product: item.product,
        size: {
          value: selectedSize.value,
          unit: selectedSize.unit,
          price: selectedSize.price
        },
        quantity: item.quantity
      });
    }

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shippingCost;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' }
    });

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      subtotal,
      tax,
      shippingCost,
      total
    });

    // Send order confirmation email
    await emailService.sendOrderConfirmationEmail(
      req.user.email,
      order._id,
      orderItems,
      total
    );

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the user or if user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'shipped') {
      order.trackingNumber = `LSCT${Date.now()}`;
      order.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      
      // Send shipping confirmation email
      await emailService.sendShippingConfirmationEmail(
        req.user.email,
        order._id,
        order.trackingNumber,
        order.estimatedDelivery
      );
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      order.paymentInfo.status = 'completed';
      order.paymentInfo.transactionId = paymentIntentId;
      order.status = 'processing';
      
      // Update product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        const sizeIndex = product.size.findIndex(s => 
          s.value === item.size.value && s.unit === item.size.unit
        );
        product.size[sizeIndex].stock -= item.quantity;
        await product.save();
      }

      await order.save();
      
      // Send payment confirmation email
      await emailService.sendPaymentConfirmationEmail(
        req.user.email,
        order._id,
        paymentIntentId
      );

      res.json({ message: 'Payment confirmed', order });
    } else {
      order.paymentInfo.status = 'failed';
      await order.save();
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 