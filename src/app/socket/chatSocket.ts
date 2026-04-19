import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';
import { Group } from '../modules/group/group.model';
import Message from '../modules/message/message.model';

const JWT_SECRET = config.jwt.accessTokenSecret || config.jwt.jwtSecret;

export const setupChatSocket = (io: Server) => {

  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) return next(new Error('No token'));

      const decoded = jwt.verify(token, JWT_SECRET as string) as any;
      socket.data.user = decoded;

      next();
    } catch {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const userId = user.id;

    onlineUsers.set(userId, socket.id);

    socket.on('joinGroup', async (groupId: string) => {
      const group = await Group.findById(groupId);
      if (!group) return;

      socket.join(groupId);

      const messages = await Message.find({ group: groupId })
        .populate('sender', 'firstName lastName email')
        .sort({ createdAt: 1 });

      socket.emit('previousMessages', messages);

      io.to(groupId).emit('onlineUsers', getGroupOnlineUsers(groupId, group));
    });

    socket.on('sendMessage', async ({ groupId, content }) => {
      if (!content?.trim()) return;

      const message = await Message.create({
        group: groupId,
        sender: userId,
        content,
      });

      const populated = await message.populate('sender', 'firstName lastName email');

      io.to(groupId).emit('receiveMessage', populated);
    });

    socket.on('typing', ({ groupId, isTyping }) => {
      socket.to(groupId).emit('userTyping', {
        userId,
        name: `${user.firstName} ${user.lastName || ''}`,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
    });

    const getGroupOnlineUsers = (groupId: string, group: any) => {
      return group.members.filter((m: any) =>
        onlineUsers.has(m.toString())
      ).map((id: any) => ({
        userId: id,
      }));
    };
  });
};