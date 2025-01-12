const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  resetPasswordValidation, 
  validateRequest 
} = require('../middleware/validate');

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword);
router.post('/send-verification', protect, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);

// Protected test route
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router; 