const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const {
  createProductValidation,
  reviewValidation,
  validateRequest
} = require('../middleware/validate');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  createProductValidation,
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  validateRequest,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteProduct
);

router.post(
  '/:id/reviews',
  protect,
  reviewValidation,
  validateRequest,
  addReview
);

module.exports = router; 