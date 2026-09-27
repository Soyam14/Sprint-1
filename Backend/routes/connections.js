const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const protect = typeof authMiddleware === 'function' ? authMiddleware : authMiddleware.protect;

// GET /api/connections - Get all swap connections involving the current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Fetch connections using strictPopulate: false to prevent schema mismatches
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }, { sender: userId }]
    })
      .populate({ path: 'requester', select: 'name email skillsOffered', strictPopulate: false })
      .populate({ path: 'recipient', select: 'name email skillsOffered', strictPopulate: false })
      .populate({ path: 'sender', select: 'name email skillsOffered', strictPopulate: false })
      .populate({ path: 'skill', select: 'title category', strictPopulate: false })
      .populate({ path: 'skillId', select: 'title category', strictPopulate: false })
      .sort({ updatedAt: -1 });

    res.json(connections);
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Failed to retrieve connections' });
  }
});

// POST /api/connections/request - Send new swap request & generate Notification
router.post('/request', protect, async (req, res) => {
  try {
    const { recipientId, skillId } = req.body;
    const requesterId = req.user._id || req.user.id;

    if (!recipientId || !skillId) {
      return res.status(400).json({ message: 'Missing recipientId or skillId' });
    }

    if (requesterId.toString() === recipientId.toString()) {
      return res.status(400).json({ message: 'Cannot request a swap on your own skill' });
    }

    // Save Connection document handling potential schema field aliases
    const newConnection = new Connection({
      requester: requesterId,
      sender: requesterId,
      recipient: recipientId,
      skill: skillId,
      skillId: skillId,
      status: 'pending'
    });
    await newConnection.save();

    // Save Notification document for recipient
    try {
      await Notification.create({
        recipient: recipientId,
        user: recipientId,
        sender: requesterId,
        type: 'request',
        message: `${req.user.name || 'A user'} sent you a skill swap request!`,
        read: false
      });
    } catch (notifErr) {
      console.error('Failed to save notification record:', notifErr.message);
    }

    res.status(201).json(newConnection);
  } catch (err) {
    console.error('Error in POST /request:', err);
    res.status(500).json({ message: 'Server error processing swap request' });
  }
});

// PUT /api/connections/:id - Update connection request status
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connection.status = status;
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error('Error updating connection:', err);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

module.exports = router;