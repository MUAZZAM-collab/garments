import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get all active products with rich filtering, searching, and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      size,
      color,
      fabric,
      minPrice,
      maxPrice,
      inStock,
      sort,
      search,
      tag,
      featured,
      page = 1,
      limit = 24,
    } = req.query;

    const query = { isActive: true };

    // Filter by Category (can be slug or ObjectId)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        } else {
          query.categoryName = new RegExp(category, 'i');
        }
      }
    }

    // Filter by Tag
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    // Filter by Featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by Fabric
    if (fabric) {
      query.fabric = new RegExp(fabric, 'i');
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Size in variants
    if (size) {
      const sizes = Array.isArray(size) ? size : size.split(',');
      query['variants.size'] = { $in: sizes };
    }

    // Filter by Color in variants
    if (color) {
      const colors = Array.isArray(color) ? color : color.split(',');
      query['variants.color'] = { $in: colors.map((c) => new RegExp(c, 'i')) };
    }

    // Filter by stock availability
    if (inStock === 'true') {
      query['variants.stock'] = { $gt: 0 };
    }

    // Keyword search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'bestseller') sortOption = { numReviews: -1, ratings: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Find related items in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('title slug price comparePrice images category variants tags');

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create new product
// @route   POST /api/products
// @access  Private / Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      subtitle,
      category,
      price,
      comparePrice,
      fabric,
      careInstructions,
      variants,
      tags,
      isFeatured,
      isActive,
      images,
      details,
    } = req.body;

    const computedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existingProduct = await Product.findOne({ slug: computedSlug });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'A product with this slug already exists.' });
    }

    const catObj = await Category.findById(category);

    const product = await Product.create({
      title,
      slug: computedSlug,
      subtitle: subtitle || '',
      description,
      category,
      categoryName: catObj ? catObj.name : '',
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      fabric: fabric || 'Fine Silk & Lace',
      careInstructions: careInstructions || 'Gentle cold hand wash.',
      variants: typeof variants === 'string' ? JSON.parse(variants) : variants || [],
      tags: typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags || [],
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      images: typeof images === 'string' ? JSON.parse(images) : images || [],
      details: typeof details === 'string' ? JSON.parse(details) : details || [],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully in atelier collection.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update product
// @route   PUT /api/products/:id
// @access  Private / Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updates = { ...req.body };
    if (updates.category) {
      const catObj = await Category.findById(updates.category);
      if (catObj) updates.categoryName = catObj.name;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete product
// @route   DELETE /api/products/:id
// @access  Private / Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product archived from catalogue.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images to Cloudinary (or fallback)
// @route   POST /api/products/upload-image
// @access  Private / Admin
export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'veloura/products');
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};
