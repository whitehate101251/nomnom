const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateAvatar
} = require('../controllers/userController');
const { validateRequest, updateProfileValidation, updatePasswordValidation } = require('../middleware/validate');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, validateRequest, updateProfile);
router.put('/password', protect, updatePasswordValidation, validateRequest, updatePassword);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router; 