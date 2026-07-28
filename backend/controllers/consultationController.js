const mongoose = require('mongoose');
const ConsultationRequest = require('../models/ConsultationRequest');

// In-memory fallback array for requests if DB is not connected
let memoryConsultations = [];

// Create a new expert consultation request
exports.createConsultation = async (req, res) => {
  try {
    const { fullName, email, phone, consultationType, timeSlot, message } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: 'Full name, email, and phone number are required.' });
    }

    const newRequest = new ConsultationRequest({
      fullName,
      email,
      phone,
      consultationType: consultationType || 'video',
      timeSlot: timeSlot || 'morning',
      message: message || '',
      status: 'Pending',
    });

    if (mongoose.connection.readyState === 1) {
      try {
        await newRequest.save();
        console.log('✅ Consultation Request saved to MongoDB successfully:', newRequest._id);
      } catch (dbError) {
        console.warn('⚠️ Database save failed for consultation. Using memory fallback:', dbError.message);
        newRequest._id = newRequest._id || new mongoose.Types.ObjectId().toString();
        newRequest.createdAt = new Date();
        memoryConsultations.unshift(newRequest);
      }
    } else {
      console.warn(`⚠️ MongoDB connection not ready (readyState=${mongoose.connection.readyState}). Using memory fallback.`);
      newRequest._id = newRequest._id || new mongoose.Types.ObjectId().toString();
      newRequest.createdAt = new Date();
      memoryConsultations.unshift(newRequest);
    }

    // Log notification for the Vastu Consultant
    console.log('====================================================');
    console.log('📞 NEW VASTU CONSULTATION REQUEST RECEIVED!');
    console.log(`Client: ${fullName}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email}`);
    console.log(`Type: ${consultationType} | Preferred Time: ${timeSlot}`);
    console.log(`Query: ${message || 'No additional notes'}`);
    console.log('====================================================');

    return res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully. A Vastu specialist will contact you shortly.',
      data: newRequest,
    });
  } catch (error) {
    console.error('Create Consultation Error:', error);
    return res.status(500).json({ message: 'Server error creating consultation request: ' + error.message });
  }
};

// List all consultation requests (for admin/expert review)
exports.getConsultations = async (req, res) => {
  try {
    let requests = [];
    try {
      requests = await ConsultationRequest.find().sort({ createdAt: -1 });
    } catch (dbErr) {
      requests = memoryConsultations;
    }
    
    // Combine if memory has items not in DB
    if (requests.length === 0 && memoryConsultations.length > 0) {
      requests = memoryConsultations;
    }

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get Consultations Error:', error);
    return res.status(500).json({ message: 'Server error fetching consultation requests' });
  }
};

// Update status of consultation request
exports.updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Contacted', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
      const updated = await ConsultationRequest.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.status(200).json({ success: true, data: updated });
      }
    } catch (dbErr) {
      // Memory fallback update
      const item = memoryConsultations.find(m => m._id.toString() === id);
      if (item) {
        item.status = status;
        return res.status(200).json({ success: true, data: item });
      }
    }

    return res.status(404).json({ message: 'Consultation request not found' });
  } catch (error) {
    console.error('Update Consultation Status Error:', error);
    return res.status(500).json({ message: 'Server error updating status' });
  }
};

// Delete consultation request
exports.deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await ConsultationRequest.findByIdAndDelete(id);
    } catch (dbErr) {
      memoryConsultations = memoryConsultations.filter(m => m._id.toString() !== id);
    }
    return res.status(200).json({ success: true, message: 'Consultation request deleted.' });
  } catch (error) {
    console.error('Delete Consultation Error:', error);
    return res.status(500).json({ message: 'Server error deleting consultation' });
  }
};
