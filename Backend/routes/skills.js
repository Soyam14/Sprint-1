const express = require('express');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().populate('user', 'name email');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { title, category, description } = req.body;
  try {
    const skill = await Skill.create({ title, category, description, user: req.user.id });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;