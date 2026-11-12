const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  leaveTeam,
  getRecommendations,
  inviteMember,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTeam);
router.get('/', getTeams);
router.get('/my-teams', protect, getMyTeams);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getTeamById);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/leave', protect, leaveTeam);
router.post('/:id/invite', protect, inviteMember);

module.exports = router;
