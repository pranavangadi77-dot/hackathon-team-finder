const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Team, JoinRequest } = require('../models');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const generateToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET || 'hackmate_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const userData = {
      ...validatedData,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
    };

    const newUser = await User.create(userData);
    const token = generateToken(newUser._id);

    const userObj = { ...newUser };
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to HackMate.',
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // If using Mongoose, explicitly select password
    let user;
    if (User.isMongoose && User.isMongoose()) {
      const MongooseUser = require('../models/User');
      user = await MongooseUser.findOne({ email: email.toLowerCase() }).select('+password');
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    // Clean user response
    const userDoc = user.toObject ? user.toObject() : { ...user };
    delete userDoc.password;

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details & stats
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    const cleanUser = user.toObject ? user.toObject() : { ...user };
    if (cleanUser.password) delete cleanUser.password;

    // Calculate profile completion percentage
    let totalFields = 10;
    let completedFields = 0;
    if (cleanUser.name) completedFields++;
    if (cleanUser.email) completedFields++;
    if (cleanUser.college) completedFields++;
    if (cleanUser.branch) completedFields++;
    if (cleanUser.technicalSkills && cleanUser.technicalSkills.length > 0) completedFields++;
    if (cleanUser.nonTechnicalSkills && cleanUser.nonTechnicalSkills.length > 0) completedFields++;
    if (cleanUser.interests && cleanUser.interests.length > 0) completedFields++;
    if (cleanUser.experience) completedFields++;
    if (cleanUser.bio) completedFields++;
    if (cleanUser.githubUrl || cleanUser.linkedinUrl || cleanUser.portfolioUrl) completedFields++;

    const profileCompletion = Math.round((completedFields / totalFields) * 100);

    // Get count stats
    const myCreatedTeamsCount = await Team.countDocuments({ leader: req.user._id });
    const myJoinedTeamsCount = await Team.countDocuments({
      members: req.user._id,
      leader: { $ne: req.user._id },
    });
    const pendingOutgoingCount = await JoinRequest.countDocuments({
      student: req.user._id,
      status: 'Pending',
    });

    res.json({
      success: true,
      user: cleanUser,
      profileCompletion,
      stats: {
        createdTeams: myCreatedTeamsCount,
        joinedTeams: myJoinedTeamsCount,
        pendingRequests: pendingOutgoingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
