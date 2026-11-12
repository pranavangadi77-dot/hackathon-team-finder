const { Team, User, Notification, JoinRequest } = require('../models');
const { createTeamSchema, updateTeamSchema } = require('../validators/teamValidator');
const { calculateRecommendations } = require('../services/recommendationService');

// @desc    Create a new hackathon team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
  try {
    const validatedData = createTeamSchema.parse(req.body);

    const teamTitle = validatedData.teamName || validatedData.name || 'Untitled Team';
    const maxCapacity = validatedData.maximumMembers || validatedData.maxMembers || 4;
    const availablePositions = Math.max(0, maxCapacity - 1);

    const deadline = validatedData.hackathonDeadline || validatedData.applicationDeadline || null;
    const eventDate = validatedData.hackathonDate || validatedData.eventDate || null;

    const teamData = {
      ...validatedData,
      teamName: teamTitle,
      name: teamTitle,
      maximumMembers: maxCapacity,
      maxMembers: maxCapacity,
      college: validatedData.college || req.user.college || '',
      leader: req.user._id,
      members: [req.user._id],
      availablePositions,
      hackathonDeadline: deadline,
      applicationDeadline: deadline,
      hackathonDate: eventDate,
      eventDate,
      missingSkills: validatedData.missingSkills || [],
      requiredSkills: validatedData.requiredSkills || validatedData.missingSkills || [],
      availableRoles: validatedData.availableRoles || [],
      status: availablePositions === 0 ? 'Full' : 'Open',
    };

    const newTeam = await Team.create(teamData);

    res.status(201).json({
      success: true,
      message: 'Team successfully created and published!',
      team: newTeam,
      data: newTeam,
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
        { teamName: regex },
        { projectTitle: regex },
        { description: regex },
        { hackathonName: regex },
      ];
    }

    if (hackathonName) {
      query.hackathonName = new RegExp(hackathonName, 'i');
    }

    if (college) {
      query.college = new RegExp(college, 'i');
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (openPositionsOnly === 'true') {
      query.status = 'Open';
      query.availablePositions = { $gt: 0 };
    }

    let teams = await Team.find(query);

    // Filter by skill if requested
    if (skill) {
      const searchSkill = skill.toLowerCase().trim();
      teams = teams.filter((t) => {
        const reqs = (t.requiredSkills || []).map((s) => s.toLowerCase());
        const miss = (t.missingSkills || []).map((s) => s.toLowerCase());
        return (
          reqs.some((s) => s.includes(searchSkill)) ||
          miss.some((s) => s.includes(searchSkill))
        );
      });
    }

    // Sort
    if (sort === 'open_positions') {
      teams.sort((a, b) => (b.availablePositions || 0) - (a.availablePositions || 0));
    } else if (sort === 'oldest') {
      teams.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default: newest
      teams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: teams.length,
      teams,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's joined & led teams
// @route   GET /api/teams/my-teams
// @access  Private
const getMyTeams = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const allTeams = await Team.find({});

    const myTeams = allTeams.filter((t) => {
      const isLeader = (t.leader?._id ? t.leader._id.toString() : t.leader?.toString()) === userId;
      const isMember = (t.members || []).some(
        (m) => (m?._id ? m._id.toString() : m?.toString()) === userId
      );
      return isLeader || isMember;
    });

    res.json({
      success: true,
      count: myTeams.length,
      teams: myTeams,
      data: myTeams,
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
        message: 'Team not found.',
      });
    }

    res.json({
      success: true,
      team,
      data: team,
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

    const updatePayload = {
      ...validatedData,
    };
    if (validatedData.teamName) updatePayload.name = validatedData.teamName;
    if (validatedData.name) updatePayload.teamName = validatedData.name;
    if (validatedData.maximumMembers) updatePayload.maxMembers = validatedData.maximumMembers;
    if (validatedData.maxMembers) updatePayload.maximumMembers = validatedData.maxMembers;

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Team information updated successfully!',
      team: updatedTeam,
      data: updatedTeam,
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

// @desc    Leave team (Non-leader only)
// @route   POST /api/teams/:id/leave
// @access  Private
const leaveTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found.',
      });
    }

    const userId = req.user._id.toString();
    const leaderId = team.leader?._id ? team.leader._id.toString() : team.leader.toString();

    if (userId === leaderId) {
      return res.status(400).json({
        success: false,
        message: 'The team leader cannot leave the team without transferring leadership or deleting the team.',
      });
    }

    const isMember = (team.members || []).some(
      (m) => (m?._id ? m._id.toString() : m?.toString()) === userId
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this team.',
      });
    }

    const updatedMembers = (team.members || []).filter(
      (m) => (m?._id ? m._id.toString() : m?.toString()) !== userId
    );
    const newAvailablePositions = (team.availablePositions || 0) + 1;

    const updatedTeam = await Team.findByIdAndUpdate(
      team._id,
      {
        $set: {
          members: updatedMembers,
          availablePositions: newAvailablePositions,
          status: 'Open',
        },
      },
      { new: true }
    );

    // Notify team leader
    await Notification.create({
      recipient: team.leader?._id || team.leader,
      sender: req.user._id,
      title: 'Member Left Team',
      message: `${req.user.name} has left your team "${team.name || team.teamName}".`,
      type: 'general',
      team: team._id,
    });

    res.json({
      success: true,
      message: 'You have left the team successfully.',
      team: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic skill-gap recommendations for logged-in student
// @route   GET /api/recommendations and GET /api/teams/recommendations
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

    // Fetch user's existing requests to exclude teams already requested
    const existingRequests = await JoinRequest.find({ student: req.user._id });

    const recommendations = await calculateRecommendations(user, openTeams, existingRequests);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
      data: recommendations,
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
      title: `Team Invitation: ${team.name || team.teamName}`,
      message: `${req.user.name} invited you to join "${team.name || team.teamName}" for "${team.hackathonName}"!`,
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
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  leaveTeam,
  getRecommendations,
  inviteMember,
};
