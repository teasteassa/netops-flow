import express from 'express';
import { loadDevices, loadVlans, loadFirewallRules, loadVpnTunnels } from '../utils/fileStorage.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [devices, vlans, firewallRules, vpnTunnels] = await Promise.all([
      loadDevices(),
      loadVlans(),
      loadFirewallRules(),
      loadVpnTunnels()
    ]);
    
    const stats = {
      devices: {
        total: devices.length,
        online: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        unknown: devices.filter(d => d.status === 'unknown').length
      },
      vlans: {
        total: vlans.length,
        active: vlans.filter(v => v.status === 'active').length,
        warning: vlans.filter(v => v.status === 'warning').length,
        inactive: vlans.filter(v => v.status === 'inactive').length
      },
      firewall: {
        totalRules: firewallRules.length,
        activeRules: firewallRules.filter(r => r.status === 'active').length,
        totalHits: firewallRules.reduce((sum, rule) => sum + (rule.hits || 0), 0),
        threatsBlocked: firewallRules.filter(r => r.action === 'deny').reduce((sum, rule) => sum + (rule.hits || 0), 0)
      },
      vpn: {
        totalTunnels: vpnTunnels.length,
        activeTunnels: vpnTunnels.filter(t => t.status === 'up').length,
        totalBandwidth: calculateTotalBandwidth(vpnTunnels),
        remoteUsers: vpnTunnels.filter(t => t.type === 'remote-access').length
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    // Simulate recent activity based on stored data
    const activity = [
      {
        id: 1,
        type: 'device_status',
        message: 'Router-1 came online',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        severity: 'info'
      },
      {
        id: 2,
        type: 'vlan_created',
        message: 'VLAN 300 "DMZ" created on Switch-1',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        severity: 'success'
      },
      {
        id: 3,
        type: 'firewall_rule',
        message: 'New firewall rule added: Block P2P Traffic',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        severity: 'warning'
      },
      {
        id: 4,
        type: 'vpn_tunnel',
        message: 'VPN tunnel to Site-B established',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        severity: 'success'
      },
      {
        id: 5,
        type: 'device_config',
        message: 'Configuration backup completed for all devices',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        severity: 'info'
      }
    ];
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get network topology data
router.get('/topology', async (req, res) => {
  try {
    const devices = await loadDevices();
    
    // Create simplified topology data
    const nodes = devices.map(device => ({
      id: device.id,
      name: device.name,
      type: device.type,
      ip: device.ip,
      status: device.status,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100
    }));
    
    // Create some sample links between devices
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: 'ethernet',
        status: 'up'
      });
    }
    
    res.json({
      nodes,
      links
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const devices = await loadDevices();
    
    const health = {
      overall: 'healthy',
      services: {
        gns3Server: 'healthy',
        deviceConnections: 'healthy',
        fileStorage: 'healthy',
        authentication: 'healthy'
      },
      metrics: {
        deviceUptime: Math.floor(Math.random() * 100),
        networkLatency: Math.floor(Math.random() * 50) + 10,
        systemLoad: Math.floor(Math.random() * 80) + 10,
        memoryUsage: Math.floor(Math.random() * 70) + 20
      },
      lastUpdated: new Date().toISOString()
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateTotalBandwidth(tunnels) {
  // Calculate total bandwidth from all active tunnels
  const activeTunnels = tunnels.filter(t => t.status === 'up');
  return activeTunnels.length * 100; // Assume 100 Mbps per tunnel
}

export default router;