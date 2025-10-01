import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';

import '../src/config/passport';
import authRouter from './routes/guest/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/guest', authRouter);

const PORT = process.env.PORT! || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
