const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod } = req.body;
    const cartItems = req.body.cartItems || [];
    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product " + item.name + " not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: product.name + " has insufficient stock" });
      }
    }
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      orderItems: cartItems.map(item => ({ product: item.product, name: item.name, image: item.image, price: item.price, quantity: item.quantity })),
      totalAmount,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || "Cash on Delivery"
    });
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product", "name");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").populate("orderItems.product", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
