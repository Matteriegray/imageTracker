const express = require('express');
const Evidence = require('../models/Evidence');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all evidence for a case
router.get('/case/:caseId', authMiddleware, async (req, res) => {
  try {
    const evidence = await Evidence.find({ caseId: req.params.caseId }).sort({ createdAt: -1 });
    res.json(evidence);
  } catch (error) {
    console.error('Fetch evidence error:', error);
    res.status(500).json({ message: 'Unable to fetch evidence' });
  }
});

// Create evidence
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { caseId, evidenceType, description, location, photoUrl } = req.body;

    if (!caseId || !evidenceType || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const evidence = new Evidence({
      caseId,
      evidenceType,
      description,
      location,
      photoUrl,
      chainOfCustody: [{
        action: 'collected',
        officer: {
          name: req.user.name,
          badge: req.user.badge
        },
        date: new Date()
      }]
    });

    await evidence.save();
    res.status(201).json(evidence);
  } catch (error) {
    console.error('Create evidence error:', error);
    res.status(500).json({ message: 'Unable to create evidence' });
  }
});

// Get single evidence
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.json(evidence);
  } catch (error) {
    console.error('Fetch evidence error:', error);
    res.status(500).json({ message: 'Unable to fetch evidence' });
  }
});

// Add chain of custody entry
router.post('/:id/custody', authMiddleware, async (req, res) => {
  try {
    const { action, transferredFrom, transferredTo, receivedBy, notes } = req.body;

    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          chainOfCustody: {
            action,
            officer: {
              name: req.user.name,
              badge: req.user.badge
            },
            transferredFrom,
            transferredTo,
            receivedBy,
            notes,
            date: new Date()
          }
        },
        status: action === 'transferred' ? 'in-transit' : action === 'received' ? 'stored' : action
      },
      { new: true }
    );

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    res.json(evidence);
  } catch (error) {
    console.error('Add custody error:', error);
    res.status(500).json({ message: 'Unable to add custody record' });
  }
});

// Update evidence status
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    res.json(evidence);
  } catch (error) {
    console.error('Update evidence error:', error);
    res.status(500).json({ message: 'Unable to update evidence' });
  }
});

module.exports = router;
