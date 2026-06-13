const mongoose = require('mongoose');

const EvidenceRelationshipSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  nodeType: {
    type: String,
    enum: ['witness', 'suspect', 'victim', 'evidence'],
    required: true
  },
  nodeName: {
    type: String,
    required: true
  },
  description: String,
  details: {
    age: Number,
    relationship: String,
    statement: String,
    status: String
  },
  connections: [{
    targetNodeId: mongoose.Schema.Types.ObjectId,
    relationshipType: {
      type: String,
      enum: ['knows', 'witnessed', 'involved-with', 'connected-to', 'suspect'],
      required: true
    },
    strength: {
      type: String,
      enum: ['strong', 'moderate', 'weak'],
      default: 'moderate'
    },
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EvidenceRelationship', EvidenceRelationshipSchema);
