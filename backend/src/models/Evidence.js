const mongoose = require('mongoose');

const ChainOfCustodySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['collected', 'transferred', 'received', 'analyzed', 'stored'],
    required: true
  },
  officer: {
    name: String,
    badge: String
  },
  transferredFrom: String,
  transferredTo: String,
  receivedBy: {
    name: String,
    badge: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const EvidenceSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  evidenceType: {
    type: String,
    enum: ['weapon', 'dna', 'document', 'photo', 'trace', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: String,
  photoUrl: String,
  status: {
    type: String,
    enum: ['collected', 'in-transit', 'stored', 'analyzed', 'released'],
    default: 'collected'
  },
  chainOfCustody: [ChainOfCustodySchema],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evidence', EvidenceSchema);
