const express = require('express');
const router = express.Router();
const {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getTeamRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.get('/my-requests', protect, getOutgoingRequests);
router.get('/team/:teamId', protect, getTeamRequests);
router.patch('/:id/accept', protect, acceptRequest);
router.patch('/:id/reject', protect, rejectRequest);
router.patch('/:id/cancel', protect, cancelRequest);

module.exports = router;
