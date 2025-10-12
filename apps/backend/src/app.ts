import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import '../src/config/passport';
import commentRouter from './routes/admin/commentRoutes';
import followRouter from './routes/admin/followRoutes';
import likesRouter from './routes/admin/likeRoutes';
import postRouter from './routes/admin/postRoutes';
import userRouter from './routes/admin/userRoutes';
import authRouter from './routes/guest/authRoutes';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

dotenv.config();

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/follows', followRouter);
app.use('/api/likes', likesRouter);

const PORT = process.env.PORT! || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
