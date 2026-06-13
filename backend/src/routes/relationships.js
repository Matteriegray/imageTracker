const express = require('express');
const EvidenceRelationship = require('../models/EvidenceRelationship');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all relationships for a case
router.get('/case/:caseId', authMiddleware, async (req, res) => {
  try {
    const relationships = await EvidenceRelationship.find({ caseId: req.params.caseId });
    res.json(relationships);
  } catch (error) {
    console.error('Fetch relationships error:', error);
    res.status(500).json({ message: 'Unable to fetch relationships' });
  }
});

// Create a node (witness, suspect, victim, or evidence)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { caseId, nodeType, nodeName, description, details } = req.body;

    if (!caseId || !nodeType || !nodeName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const relationship = new EvidenceRelationship({
      caseId,
      nodeType,
      nodeName,
      description,
      details,
      connections: []
    });

    await relationship.save();
    res.status(201).json(relationship);
  } catch (error) {
    console.error('Create relationship error:', error);
    res.status(500).json({ message: 'Unable to create relationship' });
  }
});

// Get single relationship node
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const relationship = await EvidenceRelationship.findById(req.params.id);
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    res.json(relationship);
  } catch (error) {
    console.error('Fetch relationship error:', error);
    res.status(500).json({ message: 'Unable to fetch relationship' });
  }
});

// Add connection between nodes
router.post('/:id/connect', authMiddleware, async (req, res) => {
  try {
    const { targetNodeId, relationshipType, strength, notes } = req.body;

    const relationship = await EvidenceRelationship.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          connections: {
            targetNodeId,
            relationshipType,
            strength: strength || 'moderate',
            notes
          }
        }
      },
      { new: true }
    );

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    res.json(relationship);
  } catch (error) {
    console.error('Add connection error:', error);
    res.status(500).json({ message: 'Unable to add connection' });
  }
});

// Update a relationship node
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { nodeName, description, details } = req.body;

    const relationship = await EvidenceRelationship.findByIdAndUpdate(
      req.params.id,
      { nodeName, description, details },
      { new: true }
    );

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    res.json(relationship);
  } catch (error) {
    console.error('Update relationship error:', error);
    res.status(500).json({ message: 'Unable to update relationship' });
  }
});

// Delete a connection
router.delete('/:id/connect/:connectionId', authMiddleware, async (req, res) => {
  try {
    const relationship = await EvidenceRelationship.findByIdAndUpdate(
      req.params.id,
      { $pull: { connections: { _id: req.params.connectionId } } },
      { new: true }
    );

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }

    res.json(relationship);
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ message: 'Unable to delete connection' });
  }
});

module.exports = router;
