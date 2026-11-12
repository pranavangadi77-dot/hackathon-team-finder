const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    projectTitle: {
      type: String,
      default: '',
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
      default: '',
    },
    category: {
      type: String,
      default: 'Open Innovation',
    },
    college: {
      type: String,
      default: '',
      trim: true,
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
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    availableRoles: {
      type: [String],
      default: [],
    },
    maximumMembers: {
      type: Number,
      default: 4,
      min: 2,
      max: 10,
    },
    maxMembers: {
      type: Number,
      default: 4,
      min: 2,
      max: 10,
    },
    availablePositions: {
      type: Number,
      default: 3,
      min: 0,
    },
    preferredExperience: {
      type: String,
      default: 'Any',
    },
    hackathonDeadline: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    hackathonDate: {
      type: Date,
    },
    eventDate: {
      type: Date,
    },
    contactInfo: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Full', 'Closed', 'Archived'],
      default: 'Open',
    },
    visibility: {
      type: String,
      enum: ['Public', 'College Only', 'Private'],
      default: 'Public',
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ hackathonName: 1 });
teamSchema.index({ name: 1 });
teamSchema.index({ teamName: 1 });
teamSchema.index({ requiredSkills: 1 });
teamSchema.index({ missingSkills: 1 });

module.exports = mongoose.model('Team', teamSchema);
