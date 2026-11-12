const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      default: '3rd Year',
    },
    yearOfStudy: {
      type: String,
      default: '3rd Year',
    },
    avatar: {
      type: String,
      default: '',
    },
    technicalSkills: {
      type: [String],
      default: [],
    },
    nonTechnicalSkills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: 'Intermediate (1-3 hackathons)',
    },
    experienceLevel: {
      type: String,
      default: 'Intermediate',
    },
    previousHackathons: {
      type: [String],
      default: [],
    },
    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    github: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      default: 'Available',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ technicalSkills: 1 });
userSchema.index({ college: 1 });

module.exports = mongoose.model('User', userSchema);
