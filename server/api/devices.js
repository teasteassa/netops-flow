import express from 'express';
import { NodeSSH } from 'node-ssh';
import { loadDevices, saveDevices, loadConfig } from '../utils/fileStorage.js';
import { executeDeviceCommand } from '../utils/deviceConnector.js';

const router = express.Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await loadDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new device
router.post('/', async (req, res) => {
  try {
    const device = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'unknown'
    };
    
    const devices = await loadDevices();
    devices.push(device);
    await saveDevices(devices);
    
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test device connectivity
router.post('/:deviceId/test', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const devices = await loadDevices();
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    const ssh = new NodeSSH();
    
    try {
      await ssh.connect({
        host: device.ip,
        username: device.username,
        password: device.password,
        port: device.sshPort || 22,
        readyTimeout: 10000
      });
      
      // Test basic command
      const result = await ssh.execCommand('show version', { execOptions: { pty: true } });
      
      ssh.dispose();
      
      // Update device status
      device.status = 'online';
      device.lastSeen = new Date().toISOString();
      await saveDevices(devices);
      
      res.json({
        status: 'success',
        connected: true,
        lastSeen: device.lastSeen,
        output: result.stdout.slice(0, 500) // Truncate output
      });
      
    } catch (sshError) {
      device.status = 'offline';
      await saveDevices(devices);
      
      res.json({
        status: 'failed',
        connected: false,
        error: sshError.message
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute command on device
router.post('/:deviceId/execute', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { command } = req.body;
    
    const result = await executeDeviceCommand(deviceId, command);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get device configuration
router.get('/:deviceId/config', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const result = await executeDeviceCommand(deviceId, 'show running-config');
    
    res.json({
      deviceId,
      configuration: result.output,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get device interfaces
router.get('/:deviceId/interfaces', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const result = await executeDeviceCommand(deviceId, 'show interfaces brief');
    
    // Parse interface information (simplified)
    const interfaces = parseInterfaceOutput(result.output);
    
    res.json({
      deviceId,
      interfaces,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update device
router.put('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const devices = await loadDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);
    
    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    devices[deviceIndex] = {
      ...devices[deviceIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await saveDevices(devices);
    res.json(devices[deviceIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete device
router.delete('/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const devices = await loadDevices();
    const filteredDevices = devices.filter(d => d.id !== deviceId);
    
    await saveDevices(filteredDevices);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function parseInterfaceOutput(output) {
  // Simplified interface parsing - should be enhanced for production
  const lines = output.split('\n');
  const interfaces = [];
  
  for (const line of lines) {
    if (line.includes('GigabitEthernet') || line.includes('FastEthernet')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        interfaces.push({
          name: parts[0],
          status: parts[1],
          protocol: parts[2],
          description: parts.slice(3).join(' ')
        });
      }
    }
  }
  
  return interfaces;
}

export default router;