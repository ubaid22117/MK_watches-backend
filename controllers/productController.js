const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

// ─── GET ALL PRODUCTS ───────────────────────
// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

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

    let sortOption = { createdAt: -1 };
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

    const {
      name, description, price, discountPrice,
      category, brand, stock, specifications,
      isFeatured, isNewArrival, isBestSeller,
      existingImages,
    } = req.body;

    let images = existingImages ? JSON.parse(existingImages) : product.images;

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

    const removedImages = product.images.filter(
      oldImg => !images.some(newImg => newImg.public_id === oldImg.public_id)
    );
    for (const img of removedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;
    product.images = images;
    product.specifications = specifications ? JSON.parse(specifications) : product.specifications;
    product.isNewArrival = isNewArrival === 'true';
    product.isBestSeller = isBestSeller === 'true';
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';

    const updated = await product.save();

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