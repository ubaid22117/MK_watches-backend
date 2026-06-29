const Order = require('../models/orderModel');
const {
  sendOrderConfirmation,
  sendAdminOrderAlert,
  sendOrderStatusUpdate,
} = require('../config/email');

// ─── CREATE ORDER ────────────────────────────────────────────────
// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customerInfo, orderItems, itemsPrice,
      shippingPrice, totalPrice, orderSource,
      paymentMethod, paymentDetails,
    } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'Order mein koi item nahi hai' });

    const needsVerification = ['EasyPaisa', 'JazzCash', 'Card', 'Bank Transfer']
      .includes(paymentMethod);

    const order = await Order.create({
      user: req.user._id,
      customerInfo,
      orderItems,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderSource: orderSource || 'Website',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentDetails: paymentDetails || {},
      paymentStatus: needsVerification ? 'Awaiting Verification' : 'Not Required',
      status: needsVerification ? 'Awaiting Payment' : 'Pending',
    });

    // User populate karo email ke liye
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email');

    const customerName = populatedOrder.user?.name || customerInfo?.name || 'Customer';
    const customerEmail = populatedOrder.user?.email;

    // ── Email: Customer ko confirmation ──
    if (customerEmail) {
      try {
        await sendOrderConfirmation(customerEmail, customerName, populatedOrder);
      } catch (err) {
        console.error('Customer confirmation email failed:', err.message);
      }
    }

    // ── Email: Admin ko alert ──
    try {
      await sendAdminOrderAlert(populatedOrder, customerName);
    } catch (err) {
      console.error('Admin alert email failed:', err.message);
    }

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY ORDERS ───────────────────────────────────────────────
// GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL ORDERS (Admin) ──────────────────────────────────────
// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE ORDER STATUS (Admin) ─────────────────────────────────
// PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order)
      return res.status(404).json({ message: 'Order nahi mila' });

    const prevStatus = order.status;
    order.status = req.body.status;

    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // ── Email: status change hone par customer ko notify karo ──
    if (req.body.status !== prevStatus && order.user?.email) {
      try {
        await sendOrderStatusUpdate(
          order.user.email,
          order.user.name,
          updatedOrder,
          req.body.status
        );
      } catch (err) {
        console.error('Status update email failed:', err.message);
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── VERIFY PAYMENT (Admin) ──────────────────────────────────────
// PUT /api/orders/:id/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { action } = req.body; // 'verify' or 'reject'
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order)
      return res.status(404).json({ message: 'Order nahi mila' });

    if (action === 'verify') {
      order.paymentStatus = 'Verified';
      order.paymentVerifiedAt = Date.now();
      order.status = 'Pending';
    } else if (action === 'reject') {
      order.paymentStatus = 'Rejected';
      order.status = 'Cancelled';
    }

    const updatedOrder = await order.save();

    // ── Email: payment verify/reject hone par customer ko notify ──
    if (order.user?.email) {
      const newStatus = action === 'verify' ? 'Pending' : 'Cancelled';
      try {
        await sendOrderStatusUpdate(
          order.user.email,
          order.user.name,
          updatedOrder,
          newStatus
        );
      } catch (err) {
        console.error('Payment verify email failed:', err.message);
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET DASHBOARD STATS (Admin) ─────────────────────────────────
// GET /api/orders/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders     = await Order.countDocuments();
    const pendingOrders   = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const awaitingPayment = await Order.countDocuments({
      paymentStatus: 'Awaiting Verification',
    });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        awaitingPayment,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  verifyPayment,
};