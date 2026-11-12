const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);

module.exports = router;
