const express = require('express');
const Case = require('../models/Case');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const generateCaseNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `CASE-${new Date().getFullYear()}-${timestamp}`;
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const cases = await Case.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error('Fetch cases error:', error);
    res.status(500).json({ message: 'Unable to fetch cases' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, location, description, priority, sceneImageName, sceneImageUrl, scenePhotos } = req.body;
    if (!title || !location) {
      return res.status(400).json({ message: 'Title and location are required' });
    }

    const caseRecord = new Case({
      caseNumber: generateCaseNumber(),
      title,
      location,
      description,
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      status: 'active',
      sceneImageName,
      sceneImageUrl,
      scenePhotos: scenePhotos || [],
      createdBy: req.user.id,
      createdByName: req.user.name
    });

    await caseRecord.save();
    res.status(201).json(caseRecord);
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ message: 'Unable to create case' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const caseRecord = await Case.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!caseRecord) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(caseRecord);
  } catch (error) {
    console.error('Fetch case detail error:', error);
    res.status(500).json({ message: 'Unable to fetch case' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, title, location, description, priority, scenePhotos, sceneImageName, sceneImageUrl } = req.body;
    const updateData = {};

    // Handle status updates
    if (status !== undefined) {
      if (!['active', 'closed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      updateData.status = status;
    }

    // Handle case detail updates
    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
      }
      updateData.priority = priority;
    }

    if (scenePhotos !== undefined) {
      updateData.scenePhotos = Array.isArray(scenePhotos) ? scenePhotos : [];
      updateData.sceneImageName = sceneImageName || null;
      updateData.sceneImageUrl = sceneImageUrl || null;
    }

    const caseRecord = await Case.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updateData,
      { new: true }
    );

    if (!caseRecord) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(caseRecord);
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({ message: 'Unable to update case' });
  }
});

module.exports = router;
