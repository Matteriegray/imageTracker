const express = require('express');
const mongoose = require('mongoose');
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database not connected. Please contact administrator.',
      hint: 'MongoDB IP whitelist may need to be configured'
    });
  }
  next();
};

// Get all evidence for a case
router.get('/case/:caseId', authMiddleware, checkDbConnection, async (req, res) => {
  try {
    const { caseId } = req.params;
    
    // Verify case exists and user has access
    const caseRecord = await Case.findOne({ _id: caseId, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const evidence = await Evidence.find({ caseId }).sort({ pinNumber: 1 });
    res.json(evidence);
  } catch (error) {
    console.error('Fetch evidence error:', error);
    res.status(500).json({ message: 'Unable to fetch evidence', error: error.message });
  }
});

// Create new evidence pin
router.post('/', authMiddleware, checkDbConnection, async (req, res) => {
  try {
    const { caseId, pinXPercent, pinYPercent, itemName, bagSerialNumber, category, description, collectedBy, photoId } = req.body;

    if (!caseId || pinXPercent === undefined || pinYPercent === undefined || !itemName) {
      return res.status(400).json({ message: 'Case ID, coordinates, and item name are required' });
    }

    // Verify case exists and user has access
    const caseRecord = await Case.findOne({ _id: caseId, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // If a photoId is provided, verify it exists in the case's scenePhotos
    if (photoId) {
      const found = caseRecord.scenePhotos && caseRecord.scenePhotos.find(p => String(p._id) === String(photoId));
      if (!found) {
        return res.status(400).json({ message: 'Provided photoId does not belong to this case' });
      }
    }

    // Get next pin number for this case
    const lastEvidence = await Evidence.findOne({ caseId }).sort({ pinNumber: -1 });
    const pinNumber = lastEvidence ? lastEvidence.pinNumber + 1 : 1;

    const evidence = new Evidence({
      caseId,
      pinNumber,
      pinXPercent,
      pinYPercent,
      itemName,
      bagSerialNumber,
      category: category || 'other',
      description,
      collectedBy: collectedBy || req.user.name,
      photoId: photoId || undefined
    });

    await evidence.save();

    // Update evidence count in case
    await Case.findByIdAndUpdate(caseId, { 
      $inc: { evidenceCount: 1 } 
    });

    res.status(201).json(evidence);
  } catch (error) {
    console.error('Create evidence error:', error);
    res.status(500).json({ message: 'Unable to create evidence', error: error.message });
  }
});

// Update evidence
router.patch('/:id', authMiddleware, checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, bagSerialNumber, category, description, collectedBy } = req.body;

    const evidence = await Evidence.findById(id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    // Verify case access
    const caseRecord = await Case.findOne({ _id: evidence.caseId, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (itemName) evidence.itemName = itemName;
    if (bagSerialNumber !== undefined) evidence.bagSerialNumber = bagSerialNumber;
    if (category) evidence.category = category;
    if (description !== undefined) evidence.description = description;
    if (collectedBy) evidence.collectedBy = collectedBy;

    await evidence.save();
    res.json(evidence);
  } catch (error) {
    console.error('Update evidence error:', error);
    res.status(500).json({ message: 'Unable to update evidence', error: error.message });
  }
});

// Add chain of custody entry
router.post('/:id/custody', authMiddleware, checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, transferredFrom, transferredTo, receivedBy, notes } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action type is required' });
    }

    const evidence = await Evidence.findById(id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    const caseRecord = await Case.findOne({ _id: evidence.caseId, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(403).json({ message: 'Access denied' });
    }

    evidence.chainOfCustody.push({
      action,
      transferredFrom,
      transferredTo,
      receivedBy,
      notes
    });

    await evidence.save();
    res.json(evidence);
  } catch (error) {
    console.error('Add custody entry error:', error);
    res.status(500).json({ message: 'Unable to add custody entry', error: error.message });
  }
});

// Delete evidence
router.delete('/:id', authMiddleware, checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;

    const evidence = await Evidence.findById(id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    // Verify case access
    const caseRecord = await Case.findOne({ _id: evidence.caseId, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Evidence.findByIdAndDelete(id);

    // Update evidence count in case
    await Case.findByIdAndUpdate(evidence.caseId, { 
      $inc: { evidenceCount: -1 } 
    });

    res.json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    console.error('Delete evidence error:', error);
    res.status(500).json({ message: 'Unable to delete evidence', error: error.message });
  }
});

module.exports = router;
