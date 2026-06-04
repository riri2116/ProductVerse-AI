import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { initMultiplayerSockets } from './sockets/multiplayer';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev simplicity
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Initialize Socket.IO handlers
initMultiplayerSockets(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  ProductVerse AI Backend Server running  `);
  console.log(`  Port: ${PORT}                           `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
