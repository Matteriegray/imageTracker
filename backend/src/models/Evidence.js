const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  pinNumber: {
    type: Number,
    required: true
  },
  pinXPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pinYPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  bagSerialNumber: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['weapon', 'biological', 'trace', 'document', 'digital', 'impression', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  collectedBy: {
    type: String,
    trim: true
  },
  chainOfCustody: {
    type: [
      new mongoose.Schema({
        action: { type: String, required: true, trim: true },
        transferredFrom: { type: String, trim: true },
        transferredTo: { type: String, trim: true },
        receivedBy: { type: String, trim: true },
        notes: { type: String, trim: true },
        date: { type: Date, default: Date.now }
      }, { _id: false })
    ],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique pin numbers per case
EvidenceSchema.index({ caseId: 1, pinNumber: 1 }, { unique: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);
