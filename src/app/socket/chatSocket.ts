import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';           // তোমার config import করো
import { Group } from '../modules/group/group.model';
import Message from '../modules/message/message.model';


const JWT_SECRET = config.jwt.accessTokenSecret || config.jwt.jwtSecret;

if (!JWT_SECRET) {
  console.error('JWT Secret is missing in config! Check your .env file.');
}

export const setupChatSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      const decoded = jwt.verify(token, JWT_SECRET as string) as any;

      if (!decoded || !decoded.id) {
        return next(new Error('Invalid token'));
      }
      socket.data.user = decoded;
      next();
    } catch (err: any) {
      console.error('Socket auth error:', err.message);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user?.id || socket.data.user?._id;
    console.log(`🔌 User connected: ${userId}`);

    socket.on('joinGroup', async (groupId: string) => {
      try {
        const group = await Group.findById(groupId);
        if (!group) {
          return socket.emit('error', 'Group not found');
        }
        if (!group.members.some((member: any) => member.toString() === userId)) {
          return socket.emit('error', 'You are not a member of this group');
        }

        socket.join(groupId);
        const messages = await Message.find({ group: groupId })
          .populate('sender', 'name email')
          .sort({ createdAt: 1 })
          .limit(100);

        socket.emit('previousMessages', messages);
        socket.to(groupId).emit('userJoined', {
          userId,
          name: socket.data.user.name || socket.data.user.email,
        });
      } catch (error: any) {
        socket.emit('error', 'Failed to join group');
      }
    });

    socket.on('sendMessage', async ({ groupId, content }: { groupId: string; content: string }) => {
      try {
        if (!content?.trim()) return;

        const message = new Message({
          group: groupId,
          sender: userId,
          content: content.trim(),
        });

        await message.save();

        const populatedMessage = await message.populate('sender', 'name email');
        io.to(groupId).emit('receiveMessage', populatedMessage);
      } catch (error: any) {
        socket.emit('error', 'Failed to send message');
      }
    });
    socket.on('typing', ({ groupId, isTyping }: { groupId: string; isTyping: boolean }) => {
      socket.to(groupId).emit('userTyping', {
        userId,
        name: socket.data.user.name || socket.data.user.email,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};