const { User, Team, JoinRequest } = require('../models');
const { updateProfileSchema } = require('../validators/authValidator');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const cleanUser = user.toObject ? user.toObject() : { ...user };
    if (cleanUser.password) delete cleanUser.password;

    res.json({
      success: true,
      user: cleanUser,
      data: cleanUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with filtering & search
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const { q, skill, college, experience, yearOfStudy } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ name: regex }, { college: regex }, { bio: regex }, { branch: regex }, { department: regex }];
    }

    if (college) {
      query.college = new RegExp(college, 'i');
    }

    if (experience) {
      query.experience = experience;
    }

    if (yearOfStudy) {
      query.$or = [{ yearOfStudy }, { year: yearOfStudy }];
    }

    let users = await User.find(query);

    // Filter by skill in memory if provided (case-insensitive substring)
    if (skill) {
      const skillsToMatch = skill.split(',').map((s) => s.trim().toLowerCase());
      users = users.filter((u) => {
        const uSkills = [
          ...(u.technicalSkills || []),
          ...(u.nonTechnicalSkills || []),
        ].map((s) => s.toLowerCase());
        return skillsToMatch.some((sm) => uSkills.some((us) => us.includes(sm)));
      });
    }

    res.json({
      success: true,
      count: users.length,
      users,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const cleanUser = user.toObject ? user.toObject() : { ...user };
    if (cleanUser.password) delete cleanUser.password;

    res.json({
      success: true,
      user: cleanUser,
      data: cleanUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/users/me and PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const updatePayload = {
      ...validatedData,
    };
    if (validatedData.department) updatePayload.branch = validatedData.department;
    if (validatedData.branch) updatePayload.department = validatedData.branch;
    if (validatedData.year) updatePayload.yearOfStudy = validatedData.year;
    if (validatedData.yearOfStudy) updatePayload.year = validatedData.yearOfStudy;
    if (validatedData.github) updatePayload.githubUrl = validatedData.github;
    if (validatedData.githubUrl) updatePayload.github = validatedData.githubUrl;
    if (validatedData.linkedin) updatePayload.linkedinUrl = validatedData.linkedin;
    if (validatedData.linkedinUrl) updatePayload.linkedin = validatedData.linkedinUrl;
    if (validatedData.portfolio) updatePayload.portfolioUrl = validatedData.portfolio;
    if (validatedData.portfolioUrl) updatePayload.portfolio = validatedData.portfolioUrl;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    const cleanUser = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
    if (cleanUser.password) delete cleanUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: cleanUser,
      data: cleanUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search students for quick autocomplete or invites
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) {
      const users = await User.find({});
      return res.json({ success: true, users: users.slice(0, 10), data: users.slice(0, 10) });
    }

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ name: regex }, { college: regex }, { technicalSkills: regex }],
    });

    res.json({
      success: true,
      users: users.slice(0, 15),
      data: users.slice(0, 15),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeUser,
  getUsers,
  getUserById,
  updateProfile,
  searchUsers,
};
