import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order (supports guest and authenticated users)
// @route   POST /api/orders
// @access  Public (Guest) / Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'Cash on Delivery',
      couponCode,
      guestInfo,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping bag is empty.' });
    }

    if (!shippingAddress || !shippingAddress.recipientName || !shippingAddress.phone || !shippingAddress.streetAddress || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete delivery details are required.' });
    }

    // Calculate subtotal and verify products
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.title || ''} not found.` });
      }

      // Find matching variant
      const variant = product.variants.find(
        (v) => v.size === item.variant?.size && v.color === item.variant?.color
      );

      if (variant && variant.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title} (${item.variant.size} - ${item.variant.color}). Available: ${variant.stock}`,
        });
      }

      const itemTotal = product.price * item.qty;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        title: product.title,
        image: item.image || (product.images[0]?.url ?? ''),
        variant: {
          size: item.variant?.size || 'Standard',
          color: item.variant?.color || 'Classic',
          sku: variant?.sku || '',
        },
        price: product.price,
        qty: item.qty,
      });

      // Deduct variant stock
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.qty);
        await product.save();
      }
    }

    // Shipping calculation (Complimentary shipping over PKR 3,500 nationwide, otherwise PKR 250)
    const shipping = subtotal >= 3500 ? 0 : 250;

    // Apply coupon discount if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon) {
        const userTier = req.user?.tier || 'Silver';
        const validity = coupon.isValid(subtotal, userTier);
        if (validity.valid) {
          if (coupon.type === 'percentage') {
            discount = Math.round((subtotal * coupon.value) / 100);
          } else {
            discount = Math.min(subtotal, coupon.value);
          }
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const total = Math.max(0, subtotal + shipping - discount);

    // Create order
    const order = await Order.create({
      user: req.user ? req.user._id : null,
      guestInfo: !req.user ? guestInfo : undefined,
      items: validatedItems,
      shippingAddress: {
        ...shippingAddress,
        country: 'Pakistan',
        discreetPackagingRequested: true,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      subtotal,
      shipping,
      discount,
      total,
      couponCode: couponCode || null,
      isCodFlaggedForConfirmation: paymentMethod === 'Cash on Delivery',
      statusHistory: [
        {
          status: 'Pending',
          changedAt: new Date(),
          comment: paymentMethod === 'Cash on Delivery'
            ? 'Order placed via Cash on Delivery. Queued for concierge telephone confirmation.'
            : `Order placed via ${paymentMethod}. Verification pending.`,
        },
      ],
    });

    // Update user stats & loyalty points if registered
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.lifetimeSpend += total;
        // Earn 1 loyalty point per PKR 100 spent
        const earnedPoints = Math.floor(total / 100);
        user.loyaltyPoints += earnedPoints;
        user.updateTier();
        await user.save();
      }
    }

    // Send confirmation email
    const recipientEmail = req.user?.email || guestInfo?.email || shippingAddress.email;
    if (recipientEmail) {
      sendOrderConfirmationEmail(order, recipientEmail).catch((err) =>
        console.error('Email dispatch error:', err)
      );
    }

    res.status(201).json({
      success: true,
      message: 'Your order has been successfully placed with VELOURA Privé.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by orderNumber or ID (supports user or guest lookup)
// @route   GET /api/orders/:identifier
// @access  Public / Private
export const getOrderByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const { phone } = req.query;

    let order = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier).populate('items.product', 'title slug images');
    } else {
      order = await Order.findOne({ orderNumber: identifier.toUpperCase() }).populate(
        'items.product',
        'title slug images'
      );
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Security check for guest / user access
    if (req.user && req.user.role !== 'admin') {
      if (order.user && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
      }
    } else if (!req.user && phone) {
      // Guest track validation: verify last 4 digits of phone
      const orderPhone = order.shippingAddress?.phone || order.guestInfo?.phone || '';
      if (!orderPhone.endsWith(phone.slice(-4))) {
        return res.status(403).json({ success: false, message: 'Phone number does not match order records.' });
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title slug images');

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all orders with filtering and pagination
// @route   GET /api/orders/admin
// @access  Private / Admin
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, paymentStatus, city, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (city && city !== 'all') {
      query['shippingAddress.city'] = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'shippingAddress.recipientName': new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
        { trackingNumber: new RegExp(search, 'i') },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone tier')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: orders.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update order status & tracking
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, courierName, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        changedAt: new Date(),
        comment: comment || `Status updated to ${orderStatus} by Concierge.`,
      });
      if (orderStatus === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (courierName) {
      order.courierName = courierName;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order ${order.orderNumber} status updated to ${order.orderStatus}.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
