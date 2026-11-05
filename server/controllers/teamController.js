const { Team, User, Notification, JoinRequest } = require('../models');
const { createTeamSchema, updateTeamSchema } = require('../validators/teamValidator');
const { calculateRecommendations } = require('../services/recommendationService');

// @desc    Create a new hackathon team opening
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
  try {
    const validatedData = createTeamSchema.parse(req.body);

    const availablePositions = Math.max(0, validatedData.maxMembers - 1);

    const teamData = {
      ...validatedData,
      leader: req.user._id,
      members: [req.user._id],
      availablePositions,
      status: availablePositions === 0 ? 'Full' : 'Open',
    };

    const newTeam = await Team.create(teamData);

    res.status(201).json({
      success: true,
      message: 'Team successfully created and published!',
      team: newTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams with filters & sorting
// @route   GET /api/teams
// @access  Public
const getTeams = async (req, res, next) => {
  try {
    const {
      q,
      skill,
      hackathonName,
      college,
      category,
      openPositionsOnly,
      sort = 'newest',
      myTeamsOnly,
    } = req.query;

    let query = {};

    if (myTeamsOnly && req.user) {
      query.$or = [{ leader: req.user._id }, { members: req.user._id }];
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [
        { name: regex },
        { projectTitle: regex },
        { description: regex },
        { hackathonName: regex },
      ];
    }

    if (hackathonName) {
      query.hackathonName = new RegExp(hackathonName, 'i');
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (openPositionsOnly === 'true') {
      query.status = 'Open';
      query.availablePositions = { $gt: 0 };
    }

    let teams = await Team.find(query);

    // Filter by required skills in-memory for precise multi-skill matching
    if (skill) {
      const skillsToMatch = skill.split(',').map((s) => s.trim().toLowerCase());
      teams = teams.filter((t) => {
        const reqSkills = (t.requiredSkills || []).map((s) => s.toLowerCase());
        return skillsToMatch.some((sm) => reqSkills.some((rs) => rs.includes(sm)));
      });
    }

    // Filter by college if requested
    if (college) {
      const colLower = college.toLowerCase();
      teams = teams.filter((t) => {
        const leaderCollege = t.leader?.college?.toLowerCase() || '';
        return leaderCollege.includes(colLower);
      });
    }

    // Sorting
    if (sort === 'deadline') {
      teams.sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
    } else if (sort === 'vacancies') {
      teams.sort((a, b) => (b.availablePositions || 0) - (a.availablePositions || 0));
    } else {
      // Default: newest first
      teams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon team not found.',
      });
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team details (Leader only)
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can modify this team.',
      });
    }

    const validatedData = updateTeamSchema.parse(req.body);

    // If maxMembers updated, recalculate availablePositions
    let updatePayload = { ...validatedData };
    if (validatedData.maxMembers !== undefined) {
      const currentMemberCount = Array.isArray(team.members) ? team.members.length : 1;
      const newAvailable = Math.max(0, validatedData.maxMembers - currentMemberCount);
      updatePayload.availablePositions = newAvailable;
      updatePayload.status = newAvailable === 0 ? 'Full' : 'Open';
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Team updated successfully!',
      team: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team (Leader only)
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can delete this team.',
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    // Cancel pending requests for this team
    const pendingRequests = await JoinRequest.find({ team: req.params.id, status: 'Pending' });
    for (const reqItem of pendingRequests) {
      await JoinRequest.findByIdAndUpdate(reqItem._id, { status: 'Cancelled' });
    }

    res.json({
      success: true,
      message: 'Team removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic skill-gap recommendations for logged-in student
// @route   GET /api/teams/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Fetch open teams with available positions
    const openTeams = await Team.find({
      status: 'Open',
      availablePositions: { $gt: 0 },
    });

    const recommendations = await calculateRecommendations(user, openTeams);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite student to team (Leader only)
// @route   POST /api/teams/:id/invite
// @access  Private
const inviteMember = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Target student ID is required',
      });
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can send team invites.',
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found',
      });
    }

    // Check if student is already in the team
    const isMember = (team.members || []).some(
      (m) => (m._id ? m._id.toString() : m.toString()) === studentId.toString()
    );
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'This student is already a member of this team.',
      });
    }

    // Send invitation notification
    await Notification.create({
      recipient: studentId,
      sender: req.user._id,
      title: `Team Invitation: ${team.name}`,
      message: `${req.user.name} invited you to join "${team.name}" for "${team.hackathonName}"!`,
      type: 'team_invitation',
      team: team._id,
    });

    res.json({
      success: true,
      message: `Invitation successfully sent to ${student.name}!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getRecommendations,
  inviteMember,
};
