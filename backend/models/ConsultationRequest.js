const mongoose = require('mongoose');

const ConsultationRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  consultationType: {
    type: String,
    enum: ['video', 'phone', 'site'],
    default: 'video',
  },
  timeSlot: {
    type: String,
    default: 'morning',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Completed'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ConsultationRequest', ConsultationRequestSchema);
