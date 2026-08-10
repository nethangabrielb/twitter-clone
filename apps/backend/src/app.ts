import express from 'express';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { createServer } from 'node:http';
import passport from 'passport';
import { Server } from 'socket.io';

import './config/passport.ts';
import {
  authMiddleware,
  guestAuthMiddleware,
} from './middlewares/authMiddleware.ts';
import bookmarkRouter from './routes/admin/bookmarkRoutes.ts';
import commentRouter from './routes/admin/commentRoutes.ts';
import followRouter from './routes/admin/followRoutes.ts';
import likesRouter from './routes/admin/likeRoutes.ts';
import messageRouter from './routes/admin/messageRoutes.ts';
import notificationRouter from './routes/admin/notificationRoutes.ts';
import postRouter from './routes/admin/postRoutes.ts';
import roomRouter from './routes/admin/roomRoutes.ts';
import userRouter from './routes/admin/userRoutes.ts';
import authRouter from './routes/guest/authRoutes.ts';
import { initSocket } from './sockets/index.ts';

dotenv.config();

process.on('unhandledRejection', (reason) => {
  console.error('[process] unhandledRejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[process] uncaughtException:', error);
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});

// Heroku terminates TLS and proxies requests; trust the first hop so
// req.ip reflects the real client for rate limiting (and req.protocol
// reflects X-Forwarded-Proto).
app.set('trust proxy', 1);

app.use(compression());

initSocket(io);

app.use(express.static('public'));
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);

app.use('/api/users', userRouter);

app.use(authMiddleware);
app.use(guestAuthMiddleware);

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/follows', followRouter);
app.use('/api/likes', likesRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/messages', messageRouter);
app.use('/api/bookmarks', bookmarkRouter);
app.use('/api/notifications', notificationRouter);

const PORT = process.env.PORT! || 5000;

httpServer.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
