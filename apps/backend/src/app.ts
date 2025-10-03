import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';

import '../src/config/passport';
import followRouter from './routes/admin/followRoutes';
import userRouter from './routes/admin/userRoutes';
import authRouter from './routes/guest/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/follows', followRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT! || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
