const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product ka naam zaroor daalo'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description zaroor daalo'],
    },
    price: {
      type: Number,
      required: [true, 'Price zaroor daalo'],
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0, // Sale price — 0 matlab koi discount nahi
    },
    category: {
      type: String,
      required: [true, 'Category zaroor daalo'],
      enum: ['Luxury', 'Sport', 'Classic', 'Digital', 'Limited Edition'],
    },
    brand: {
      type: String,
      default: 'MK',
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, // Cloudinary ID
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    specifications: {
      movement: { type: String, default: '' },      // Quartz / Automatic
      caseMaterial: { type: String, default: '' },   // Steel / Gold
      caseSize: { type: String, default: '' },       // 42mm
      waterResistance: { type: String, default: '' },// 50m
      strapMaterial: { type: String, default: '' },  // Leather / Steel
      crystal: { type: String, default: '' },        // Sapphire / Mineral
    },
    isFeatured: {
      type: Boolean,
      default: false, // Featured watches homepage par dikhenge
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;