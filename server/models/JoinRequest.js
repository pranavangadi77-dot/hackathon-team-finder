const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Personalized message is required'],
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

joinRequestSchema.index({ student: 1, team: 1 });
joinRequestSchema.index({ team: 1, status: 1 });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
