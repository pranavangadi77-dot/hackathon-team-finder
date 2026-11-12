const { JoinRequest, Team, Notification, User } = require('../models');
const { joinRequestSchema } = require('../validators/teamValidator');

// @desc    Submit a join request for a team opening
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const { teamId, message } = joinRequestSchema.parse(req.body);

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'The requested team does not exist.',
      });
    }

    // Check if team is open
    if (team.status !== 'Open' || (team.availablePositions !== undefined && team.availablePositions <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'This team has no available positions left.',
      });
    }

    // Check if deadline passed
    const deadline = team.hackathonDeadline || team.applicationDeadline;
    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this team has passed.',
      });
    }

    const userIdStr = req.user._id.toString();
    const leaderIdStr = team.leader?._id ? team.leader._id.toString() : team.leader.toString();

    // Check if user is the leader
    if (userIdStr === leaderIdStr) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request to join your own team.',
      });
    }

    // Check if user is already a member
    const isMember = (team.members || []).some(
      (m) => (m._id ? m._id.toString() : m.toString()) === userIdStr
    );
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team.',
      });
    }

    // Check duplicate pending requests
    const existingPending = await JoinRequest.findOne({
      student: req.user._id,
      team: teamId,
      status: 'Pending',
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this team.',
      });
    }

    const newRequest = await JoinRequest.create({
      student: req.user._id,
      team: teamId,
      message,
      status: 'Pending',
    });

    // Notify team leader
    await Notification.create({
      recipient: team.leader?._id || team.leader,
      sender: req.user._id,
      title: `New Join Request for ${team.name || team.teamName}`,
      message: `${req.user.name} applied to join your team "${team.name || team.teamName}" for "${team.hackathonName}".`,
      type: 'request_received',
      team: team._id,
      relatedTeam: team._id,
      relatedRequest: newRequest._id,
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully to the team leader!',
      request: newRequest,
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incoming join requests for teams led by current user
// @route   GET /api/requests/incoming
// @access  Private
const getIncomingRequests = async (req, res, next) => {
  try {
    const myTeams = await Team.find({ leader: req.user._id });
    const myTeamIds = myTeams.map((t) => t._id.toString());

    if (myTeamIds.length === 0) {
      return res.json({
        success: true,
        count: 0,
        requests: [],
        data: [],
      });
    }

    const allRequests = await JoinRequest.find({});
    const incoming = allRequests.filter((r) => {
      const tId = r.team?._id ? r.team._id.toString() : r.team?.toString();
      return myTeamIds.includes(tId);
    });

    res.json({
      success: true,
      count: incoming.length,
      requests: incoming,
      data: incoming,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get outgoing join requests submitted by current student
// @route   GET /api/requests/outgoing or /api/requests/my-requests
// @access  Private
const getOutgoingRequests = async (req, res, next) => {
  try {
    const requests = await JoinRequest.find({ student: req.user._id });

    res.json({
      success: true,
      count: requests.length,
      requests,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests for a specific team (Leader only)
// @route   GET /api/requests/team/:teamId
// @access  Private
const getTeamRequests = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    const leaderIdStr = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderIdStr !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can view this team’s requests.',
      });
    }

    const requests = await JoinRequest.find({ team: req.params.teamId });
    res.json({
      success: true,
      count: requests.length,
      requests,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a student's join request (Leader only)
// @route   PATCH /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found.',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    const team = await Team.findById(request.team._id || request.team);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Associated team not found.',
      });
    }

    const leaderIdStr = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderIdStr !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can accept join requests.',
      });
    }

    if (team.availablePositions <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept request: team is already at maximum capacity.',
      });
    }

    const studentId = request.student?._id || request.student;

    // Add student to team members and decrement available positions
    const newAvailable = Math.max(0, team.availablePositions - 1);
    const newStatus = newAvailable === 0 ? 'Full' : 'Open';

    await Team.findByIdAndUpdate(team._id, {
      $addToSet: { members: studentId },
      $set: {
        availablePositions: newAvailable,
        status: newStatus,
      },
    });

    // Update request status to Accepted
    const updatedRequest = await JoinRequest.findByIdAndUpdate(
      request._id,
      {
        $set: {
          status: 'Accepted',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
      },
      { new: true }
    );

    // Notify accepted student
    await Notification.create({
      recipient: studentId,
      sender: req.user._id,
      title: 'Join Request Accepted! 🎉',
      message: `Congratulations! Your request to join "${team.name || team.teamName}" for "${team.hackathonName}" was accepted by ${req.user.name}.`,
      type: 'request_accepted',
      team: team._id,
      relatedTeam: team._id,
      relatedRequest: updatedRequest._id,
    });

    res.json({
      success: true,
      message: 'Join request accepted! Student has been added to your team roster.',
      request: updatedRequest,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a join request (Leader only)
// @route   PATCH /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found.',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status.toLowerCase()}.`,
      });
    }

    const team = await Team.findById(request.team._id || request.team);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Associated team not found.',
      });
    }

    const leaderIdStr = team.leader?._id ? team.leader._id.toString() : team.leader.toString();
    if (leaderIdStr !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can reject join requests.',
      });
    }

    const updatedRequest = await JoinRequest.findByIdAndUpdate(
      request._id,
      {
        $set: {
          status: 'Rejected',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        },
      },
      { new: true }
    );

    const studentId = request.student?._id || request.student;

    // Notify student
    await Notification.create({
      recipient: studentId,
      sender: req.user._id,
      title: 'Join Request Status Update',
      message: `Your request to join "${team.name || team.teamName}" was declined. Don't worry, there are many other teams looking for your skills!`,
      type: 'request_rejected',
      team: team._id,
      relatedTeam: team._id,
      relatedRequest: updatedRequest._id,
    });

    res.json({
      success: true,
      message: 'Join request has been rejected.',
      request: updatedRequest,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a submitted join request (Student only)
// @route   PATCH /api/requests/:id/cancel
// @access  Private
const cancelRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found.',
      });
    }

    const studentIdStr = request.student?._id
      ? request.student._id.toString()
      : request.student.toString();

    if (studentIdStr !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own join requests.',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status.toLowerCase()}.`,
      });
    }

    const updatedRequest = await JoinRequest.findByIdAndUpdate(
      request._id,
      { $set: { status: 'Cancelled' } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Join request cancelled successfully.',
      request: updatedRequest,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getTeamRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
