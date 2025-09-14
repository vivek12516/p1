const express = require('express');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getDashboardStats
} = require('../controllers/usercontroller');
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(auth);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', upload.single('avatar'), updateUserProfile);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Admin routes
router.get('/users', getAllUsers);

module.exports = router;