const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.set('socketio', io);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

// Real-time Socket Event Handlers
io.on('connection', (socket) => {
  // Join user to their personal socket room (ensuring ID is a string)
  socket.on('join_room', (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  socket.on('send_message', async ({ senderId, recipientId, text }) => {
    try {
      if (!senderId || !recipientId || !text) return;

      // Save message to MongoDB
      const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        text,
        read: false
      });

      // Create Unread Notification
      const notif = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'NEW_MESSAGE',
        link: '/chat',
        read: false
      });

      const populatedNotif = await Notification.findById(notif._id).populate('sender', 'name');

      const targetRoom = recipientId.toString();

      // Emit live events to recipient's socket room
      io.to(targetRoom).emit('receive_message', message);
      io.to(targetRoom).emit('notification', populatedNotif);
    } catch (err) {
      console.error('Socket error during send_message:', err);
    }
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));