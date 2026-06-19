const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

// ─── GET ALL PRODUCTS ───────────────────────
// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    // Filter object banao
    let filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'low') sortOption = { price: 1 };
    if (sort === 'high') sortOption = { price: -1 };

    const products = await Product.find(filter).sort(sortOption);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE PRODUCT ─────────────────────
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET FEATURED PRODUCTS ──────────────────
// GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CREATE PRODUCT (Admin) ─────────────────
// POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, discountPrice,
      category, brand, stock, specifications,
      isFeatured, isNewArrival, isBestSeller
    } = req.body;

    // Images Cloudinary par upload karo
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'mk_watches',
        });
        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const product = await Product.create({
      name, description, price, discountPrice,
      category, brand, stock, images,
      specifications: specifications ? JSON.parse(specifications) : {},
      isFeatured: isFeatured === 'true',
      isNewArrival: isNewArrival === 'true',
      isBestSeller: isBestSeller === 'true',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE PRODUCT (Admin) ─────────────────
// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila' });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE PRODUCT (Admin) ─────────────────
// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila' });
    }

    // Cloudinary se images bhi delete karo
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};