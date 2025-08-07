import express from 'express';
import { executeDeviceCommand } from '../utils/deviceConnector.js';
import { loadVpnTunnels, saveVpnTunnels } from '../utils/fileStorage.js';

const router = express.Router();

// Get all VPN tunnels
router.get('/tunnels', async (req, res) => {
  try {
    const tunnels = await loadVpnTunnels();
    res.json(tunnels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get VPN status from device
router.get('/device/:deviceId/status', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Execute VPN status command (varies by device type)
    const result = await executeDeviceCommand(deviceId, 'show crypto session');
    
    // Parse VPN status
    const tunnels = parseVpnStatus(result.output);
    
    res.json({
      deviceId,
      tunnels,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create site-to-site VPN tunnel
router.post('/device/:deviceId/tunnels', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { name, remoteIP, localSubnet, remoteSubnet, presharedKey } = req.body;
    
    // Validate input
    if (!name || !remoteIP || !localSubnet || !remoteSubnet || !presharedKey) {
      return res.status(400).json({ error: 'All tunnel parameters are required' });
    }
    
    // Create IPSec tunnel configuration
    const commands = [
      'configure terminal',
      // Create crypto isakmp policy
      'crypto isakmp policy 10',
      'encr aes',
      'hash sha256',
      'authentication pre-share',
      'group 14',
      'exit',
      // Create isakmp key
      `crypto isakmp key ${presharedKey} address ${remoteIP}`,
      // Create IPSec transform set
      `crypto ipsec transform-set ${name}_SET esp-aes esp-sha256-hmac`,
      'exit',
      // Create crypto map
      `crypto map ${name}_MAP 10 ipsec-isakmp`,
      `set peer ${remoteIP}`,
      `set transform-set ${name}_SET`,
      `match address ${name}_ACL`,
      'exit',
      // Create ACL for interesting traffic
      `ip access-list extended ${name}_ACL`,
      `permit ip ${localSubnet} ${remoteSubnet}`,
      'exit',
      'exit',
      'write memory'
    ];
    
    // Execute commands
    const results = [];
    for (const command of commands) {
      const result = await executeDeviceCommand(deviceId, command);
      results.push(result);
    }
    
    // Update local storage
    const tunnels = await loadVpnTunnels();
    const newTunnel = {
      id: Date.now().toString(),
      name,
      type: 'site-to-site',
      localIP: 'auto',
      remoteIP,
      status: 'down',
      bandwidth: '0 Mbps',
      latency: 0,
      uptime: '0h 0m',
      bytesIn: 0,
      bytesOut: 0,
      deviceId,
      localSubnet,
      remoteSubnet,
      createdAt: new Date().toISOString()
    };
    
    tunnels.push(newTunnel);
    await saveVpnTunnels(tunnels);
    
    res.status(201).json({
      success: true,
      tunnel: newTunnel,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test VPN connectivity
router.post('/device/:deviceId/tunnels/:tunnelId/test', async (req, res) => {
  try {
    const { deviceId, tunnelId } = req.params;
    
    const tunnels = await loadVpnTunnels();
    const tunnel = tunnels.find(t => t.id === tunnelId && t.deviceId === deviceId);
    
    if (!tunnel) {
      return res.status(404).json({ error: 'Tunnel not found' });
    }
    
    // Test connectivity with ping
    const pingCommand = `ping ${tunnel.remoteIP} count 5`;
    const result = await executeDeviceCommand(deviceId, pingCommand);
    
    // Parse ping results
    const isSuccessful = result.output.includes('5 packets transmitted, 5 received');
    
    res.json({
      tunnelId,
      testResult: isSuccessful ? 'success' : 'failed',
      output: result.output,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get VPN tunnel statistics
router.get('/device/:deviceId/tunnels/:tunnelId/stats', async (req, res) => {
  try {
    const { deviceId, tunnelId } = req.params;
    
    // Execute crypto session detail command
    const result = await executeDeviceCommand(deviceId, 'show crypto session detail');
    
    // Parse statistics
    const stats = parseVpnStats(result.output, tunnelId);
    
    res.json({
      tunnelId,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete VPN tunnel
router.delete('/device/:deviceId/tunnels/:tunnelId', async (req, res) => {
  try {
    const { deviceId, tunnelId } = req.params;
    
    const tunnels = await loadVpnTunnels();
    const tunnel = tunnels.find(t => t.id === tunnelId && t.deviceId === deviceId);
    
    if (!tunnel) {
      return res.status(404).json({ error: 'Tunnel not found' });
    }
    
    // Create deletion commands
    const commands = [
      'configure terminal',
      `no crypto map ${tunnel.name}_MAP`,
      `no crypto ipsec transform-set ${tunnel.name}_SET`,
      `no ip access-list extended ${tunnel.name}_ACL`,
      `no crypto isakmp key ${tunnel.remoteIP}`,
      'exit',
      'write memory'
    ];
    
    // Execute commands
    const results = [];
    for (const command of commands) {
      const result = await executeDeviceCommand(deviceId, command);
      results.push(result);
    }
    
    // Update local storage
    const updatedTunnels = tunnels.filter(t => t.id !== tunnelId);
    await saveVpnTunnels(updatedTunnels);
    
    res.json({
      success: true,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function parseVpnStatus(output) {
  // Parse Cisco crypto session output (simplified)
  const lines = output.split('\n');
  const tunnels = [];
  
  let currentTunnel = null;
  
  for (const line of lines) {
    if (line.includes('Session status: UP')) {
      if (currentTunnel) {
        currentTunnel.status = 'up';
      }
    } else if (line.includes('Peer:')) {
      const match = line.match(/Peer: (\d+\.\d+\.\d+\.\d+)/);
      if (match) {
        currentTunnel = {
          remoteIP: match[1],
          status: 'down'
        };
        tunnels.push(currentTunnel);
      }
    }
  }
  
  return tunnels;
}

function parseVpnStats(output, tunnelId) {
  // Parse VPN statistics (simplified)
  return {
    bytesIn: Math.floor(Math.random() * 1000000),
    bytesOut: Math.floor(Math.random() * 1000000),
    packetsIn: Math.floor(Math.random() * 10000),
    packetsOut: Math.floor(Math.random() * 10000),
    uptime: '2h 15m',
    lastActivity: new Date().toISOString()
  };
}

export default router;