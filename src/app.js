import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Import route of users

import Userouter from './routes/users.routes.js';

app.use('/api/v1/users', Userouter);

// Import product Routes

import productRouter from './routes/products.routes.js';

app.use('/api/v1/products', productRouter);

// Import Customer Routes

import customerRouter from './routes/customer.routes.js';

app.use('/api/v1/customers', customerRouter);

// Import cart router

import cartRouter from './routes/cart.routes.js';

app.use('/api/v1/cart', cartRouter);

// Import Order router

import ordersRouter from './routes/orders.routes.js';

app.use('/api/v1/orders', ordersRouter);

// Import admin Router

import adminRouter from './routes/admin.routes.js';

app.use('/api/v1/admin', adminRouter);

export default app;
