const express = require('express');
const router = express.Router();
const {
  getMeUser,
  getUsers,
  getUserById,
  updateProfile,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/me', protect, getMeUser);
router.put('/me', protect, updateProfile);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);

module.exports = router;
