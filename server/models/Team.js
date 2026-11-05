const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    hackathonName: {
      type: String,
      required: [true, 'Hackathon name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    category: {
      type: String,
      default: 'Open Innovation',
      enum: [
        'AI & Machine Learning',
        'Web3 & Blockchain',
        'FinTech',
        'HealthTech & MedTech',
        'EdTech',
        'Cybersecurity',
        'IoT & Smart Hardware',
        'Sustainability & CleanTech',
        'Open Innovation',
      ],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill is needed'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Team must specify at least one required skill',
      },
    },
    maxMembers: {
      type: Number,
      required: true,
      default: 4,
      min: 2,
      max: 10,
    },
    availablePositions: {
      type: Number,
      required: true,
      default: 3,
      min: 0,
    },
    preferredExperience: {
      type: String,
      default: 'Any',
      enum: ['Any', 'Beginner Friendly', 'Intermediate', 'Advanced'],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Full', 'Completed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ hackathonName: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ requiredSkills: 1 });
teamSchema.index({ leader: 1 });

module.exports = mongoose.model('Team', teamSchema);
