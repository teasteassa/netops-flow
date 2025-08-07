import express from 'express';
import axios from 'axios';
import { loadConfig } from '../utils/config.js';

const router = express.Router();
const config = loadConfig();

const GNS3_SERVER = process.env.GNS3_SERVER_URL || 'http://127.0.0.1:3080';

// Get GNS3 server status
router.get('/status', async (req, res) => {
  try {
    const response = await axios.get(`${GNS3_SERVER}/v2/version`);
    res.json({
      status: 'connected',
      server: GNS3_SERVER,
      version: response.data.version
    });
  } catch (error) {
    res.status(500).json({
      status: 'disconnected',
      server: GNS3_SERVER,
      error: error.message
    });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const response = await axios.get(`${GNS3_SERVER}/v2/projects`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project topology
router.get('/projects/:projectId/topology', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Get nodes
    const nodesResponse = await axios.get(`${GNS3_SERVER}/v2/projects/${projectId}/nodes`);
    
    // Get links
    const linksResponse = await axios.get(`${GNS3_SERVER}/v2/projects/${projectId}/links`);
    
    res.json({
      nodes: nodesResponse.data,
      links: linksResponse.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start/Stop project
router.post('/projects/:projectId/:action', async (req, res) => {
  try {
    const { projectId, action } = req.params;
    
    if (action === 'start') {
      await axios.post(`${GNS3_SERVER}/v2/projects/${projectId}/nodes/start`);
    } else if (action === 'stop') {
      await axios.post(`${GNS3_SERVER}/v2/projects/${projectId}/nodes/stop`);
    }
    
    res.json({ success: true, action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get node console info
router.get('/projects/:projectId/nodes/:nodeId/console', async (req, res) => {
  try {
    const { projectId, nodeId } = req.params;
    const response = await axios.get(`${GNS3_SERVER}/v2/projects/${projectId}/nodes/${nodeId}`);
    
    res.json({
      console_host: response.data.console_host,
      console_port: response.data.console_port,
      console_type: response.data.console_type
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;