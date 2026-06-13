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
    const { title, location, description, priority, sceneImageName, sceneImageUrl } = req.body;
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

module.exports = router;
