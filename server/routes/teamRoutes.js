const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getRecommendations,
  inviteMember,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTeam);
router.get('/', getTeams);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getTeamById);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/invite', protect, inviteMember);

module.exports = router;
