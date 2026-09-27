const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

const protect = typeof authMiddleware === 'function' ? authMiddleware : authMiddleware.protect;

// GET /api/messages/conversations - Fetch chat partners with last message, timestamp & unread count
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = (req.user._id || req.user.id).toString();

    // 1. Fetch all connection documents
    const allConnections = await Connection.find({}).lean();
    const partnerIds = new Set();

    allConnections.forEach((conn) => {
      const connStatus = (conn.status || '').toString().toLowerCase();

      if (connStatus === 'accepted') {
        const allValues = Object.values(conn);
        let isInvolved = false;

        allValues.forEach((val) => {
          if (!val) return;
          const valStr = (val._id || val).toString();
          if (valStr === currentUserId) isInvolved = true;
        });

        if (isInvolved) {
          allValues.forEach((val) => {
            if (!val) return;
            const valStr = (val._id || val).toString();
            if (valStr !== currentUserId && /^[0-9a-fA-F]{24}$/.test(valStr)) {
              partnerIds.add(valStr);
            }
          });
        }
      }
    });

    const partnerIdArray = Array.from(partnerIds);

    // 2. Fetch User details for extracted partner IDs
    const partners = await User.find({
      _id: { $in: partnerIdArray }
    }).select('name email').lean();

    // 3. Populate latest message, timestamp, and unread count for each partner
    const conversations = await Promise.all(
      partners.map(async (partner) => {
        const partnerId = partner._id.toString();

        // Fetch latest message between current user and partner
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, recipient: partnerId },
            { sender: partnerId, recipient: currentUserId }
          ]
        }).sort({ createdAt: -1 }).lean();

        // Count unread messages sent by partner to current user
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          recipient: currentUserId,
          read: false
        });

        return {
          _id: partner._id,
          name: partner.name || 'User',
          email: partner.email || '',
          lastMessage: lastMessage ? lastMessage.text : 'No messages yet',
          timestamp: lastMessage ? lastMessage.createdAt : null,
          unreadCount
        };
      })
    );

    // Sort conversations so the latest message appears at the top
    conversations.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    res.json(conversations);
  } catch (err) {
    console.error('Error in /api/messages/conversations:', err);
    res.status(500).json({ message: 'Failed to retrieve active conversations' });
  }
});

// GET /api/messages/:userId - Message history with automatic read status update
router.get('/:userId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;
    const targetUserId = req.params.userId;

    // Mark messages from target partner as read upon opening chat
    await Message.updateMany(
      { sender: targetUserId, recipient: currentUserId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching message history:', err);
    res.status(500).json({ message: 'Failed to retrieve message history' });
  }
});

module.exports = router;