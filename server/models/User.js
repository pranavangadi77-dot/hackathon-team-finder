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
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    yearOfStudy: {
      type: String,
      default: '3rd Year',
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Other'],
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
    experience: {
      type: String,
      default: 'Intermediate (1-3 hackathons)',
      enum: [
        'Beginner (0 hackathons)',
        'Intermediate (1-3 hackathons)',
        'Advanced (4+ hackathons)',
        'Hackathon Winner / Mentor',
      ],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
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
