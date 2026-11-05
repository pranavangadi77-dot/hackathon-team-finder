const { User } = require('../models');
const { updateProfileSchema } = require('../validators/authValidator');

// @desc    Get all students with filtering & search
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const { q, skill, college, experience, yearOfStudy } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ name: regex }, { college: regex }, { bio: regex }, { branch: regex }];
    }

    if (college) {
      query.college = new RegExp(college, 'i');
    }

    if (experience) {
      query.experience = experience;
    }

    if (yearOfStudy) {
      query.yearOfStudy = yearOfStudy;
    }

    let users = await User.find(query);

    // Filter by skill in memory if provided (case-insensitive substring)
    if (skill) {
      const skillsToMatch = skill.split(',').map((s) => s.trim().toLowerCase());
      users = users.filter((u) => {
        const uSkills = (u.technicalSkills || []).map((s) => s.toLowerCase());
        return skillsToMatch.some((sm) => uSkills.some((us) => us.includes(sm)));
      });
    }

    res.json({
      success: true,
      count: users.length,
      users,
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
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    const cleanUser = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
    if (cleanUser.password) delete cleanUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: cleanUser,
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
      return res.json({ success: true, users: users.slice(0, 10) });
    }

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ name: regex }, { college: regex }, { technicalSkills: regex }],
    });

    res.json({
      success: true,
      users: users.slice(0, 15),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  searchUsers,
};
