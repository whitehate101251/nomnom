const { validationResult, check } = require('express-validator');

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty()
];

exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.resetPasswordValidation = [
  check('token', 'Token is required').notEmpty(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

exports.updateProfileValidation = [
  check('email', 'Please include a valid email').optional().isEmail(),
  check('firstName', 'First name must not be empty').optional().notEmpty(),
  check('lastName', 'Last name must not be empty').optional().notEmpty()
];

exports.updatePasswordValidation = [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'Password must be 6 or more characters').isLength({ min: 6 })
];

exports.createProductValidation = [
  check('name', 'Name is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('category', 'Valid category is required').isIn(['floral', 'woody', 'fresh', 'oriental', 'citrus']),
  check('size', 'Size must be a valid JSON array').custom((value) => {
    try {
      const sizes = JSON.parse(value);
      if (!Array.isArray(sizes)) throw new Error('Must be an array');
      return true;
    } catch (error) {
      throw new Error('Invalid size format');
    }
  })
];

exports.reviewValidation = [
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('review', 'Review text is required').notEmpty()
];

exports.createOrderValidation = [
  check('items').isArray().notEmpty().withMessage('Order must contain items'),
  check('items.*.product').isMongoId().withMessage('Invalid product ID'),
  check('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  check('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  check('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  check('shippingAddress.city').notEmpty().withMessage('City is required'),
  check('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  check('shippingAddress.country').notEmpty().withMessage('Country is required'),
  check('paymentMethod').isIn(['stripe', 'paypal']).withMessage('Invalid payment method')
];

exports.updateOrderStatusValidation = [
  check('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
]; 