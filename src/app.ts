import express from 'express';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userRoutes);

export default app;
