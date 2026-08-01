const mongoose = require('mongoose');

const UserReportSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
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
    mainEntrance: { type: String, required: true },
    kitchen: { type: String, required: true },
    masterBedroom: { type: String, required: true },
    additionalBedrooms: [{ type: String }],
    bathroom: { type: String, required: true },
    additionalBathrooms: [{ type: String }],
    poojaRoom: { type: String, required: true },
    plotFacing: { type: String, required: true },
    plotShape: { type: String, required: true },
    staircaseBalcony: { type: String, required: true },
  },
  vastuScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  breakdown: {
    entrance: { score: Number, max: Number, status: String },
    kitchen: { score: Number, max: Number, status: String },
    masterBedroom: { score: Number, max: Number, status: String },
    poojaRoom: { score: Number, max: Number, status: String },
    bathroom: { score: Number, max: Number, status: String },
    plotFacing: { score: Number, max: Number, status: String },
    plotShape: { score: Number, max: Number, status: String },
    staircaseBalcony: { score: Number, max: Number, status: String },
  },
  criticalDoshas: [String],
  defects: [
    {
      zone: { type: String, required: true },
      direction: { type: String, required: true },
      severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
      description: { type: String, required: true },
      remedy: { type: String, required: false, default: '' },
    }
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserReport', UserReportSchema);
