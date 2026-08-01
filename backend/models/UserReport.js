const mongoose = require('mongoose');

const UserReportSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  inputs: {
    mainEntrance: { type: String, default: 'N' },
    kitchen: { type: String, default: 'SE' },
    masterBedroom: { type: String, default: 'SW' },
    additionalBedrooms: [{ type: String }],
    bathroom: { type: String, default: 'NW' },
    additionalBathrooms: [{ type: String }],
    poojaRoom: { type: String, default: 'NE' },
    plotFacing: { type: String, default: 'N' },
    plotShape: { type: String, default: 'Square' },
    staircaseBalcony: { type: String, default: 'SW' },
  },
  vastuScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  breakdown: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  criticalDoshas: [String],
  defects: [
    {
      zone: String,
      direction: String,
      severity: String,
      description: String,
      remedy: String,
    }
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserReport', UserReportSchema);
