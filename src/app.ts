import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
import { setupChatSocket } from './app/socket/chatSocket';

const app = express();

const server = http.createServer(app);

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});


app.use(notFoundError);

app.use(globalErrorHandler);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST']
  }
});

setupChatSocket(io);

export default server;             