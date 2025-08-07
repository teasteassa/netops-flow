import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Import API routes
import gns3Routes from './api/gns3.js';
import deviceRoutes from './api/devices.js';
import vlanRoutes from './api/vlans.js';
import firewallRoutes from './api/firewall.js';
import vpnRoutes from './api/vpn.js';
import authRoutes from './api/auth.js';
import dashboardRoutes from './api/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/gns3', gns3Routes);
app.use('/api/devices', deviceRoutes);
app.use('/api/vlans', vlanRoutes);
app.use('/api/firewall', firewallRoutes);
app.use('/api/vpn', vpnRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Handle different message types
      console.log('Received message:', data);
    } catch (error) {
      console.error('Invalid message format:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});

export { wss };