import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './route/userRoute.js';
import incomeRouter from './route/incomeRoute.js';
import expenseRouter from './route/expenseRoute.js';
import dashboardRouter from './route/dashboardRoute.js';

const app = express();
const port = 4000;

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => res.send('API Working'));

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));