import express from 'express';
const server = express();
import cors from 'cors';
import UserRouter from './routes/userRoutes.js'
import db from './config/database.js';
import ProfileRouter from './routes/profileRoutes.js';
import OrderRouter from './routes/orderRoutes.js';
import dotenv from 'dotenv';
import staffCodeRoutes from './routes/staffCodeRoutes.js';
import staffOrderRoutes from './routes/staffOrderRoutes.js';

dotenv.config();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors());


// Routes
server.use('/api/auth', UserRouter);
server.use('/api/profile', ProfileRouter);
server.use('/api/orders', OrderRouter);
server.use('/api/staff', staffOrderRoutes);
server.use('/api/staff-codes', staffCodeRoutes);

// Test route
server.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});


server.use('/api/',UserRouter);
server.listen( 5550, () => {
    console.log('server started');
})