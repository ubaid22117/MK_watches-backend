const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    // Payment Info
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'EasyPaisa', 'JazzCash', 'Card', 'Bank Transfer'],
      default: 'Cash on Delivery',
    },
    paymentDetails: {
      transactionId: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      cardLastFour: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
    // Payment Status — controls whether order can proceed
    paymentStatus: {
      type: String,
      enum: ['Not Required', 'Awaiting Verification', 'Verified', 'Rejected'],
      default: 'Not Required',
    },
    paymentVerifiedAt: {
      type: Date,
    },
    // Order status
    status: {
      type: String,
      enum: ['Awaiting Payment', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    // Order source
    orderSource: {
      type: String,
      enum: ['Website', 'WhatsApp'],
      default: 'Website',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;