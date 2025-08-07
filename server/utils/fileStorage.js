import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const BACKUP_DIR = path.join(__dirname, '../../backups');
const LOGS_DIR = path.join(__dirname, '../../logs');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    await fs.mkdir(LOGS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Generic file operations
async function loadFromFile(filename, defaultData = []) {
  await ensureDirectories();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create with default data
      await saveToFile(filename, defaultData);
      return defaultData;
    }
    throw error;
  }
}

async function saveToFile(filename, data) {
  await ensureDirectories();
  const filePath = path.join(DATA_DIR, filename);
  
  // Create backup before saving
  try {
    const existingData = await fs.readFile(filePath, 'utf8');
    const backupPath = path.join(BACKUP_DIR, `${filename}.${Date.now()}.bak`);
    await fs.writeFile(backupPath, existingData);
  } catch (error) {
    // Ignore backup errors for new files
  }
  
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Device management
export async function loadDevices() {
  return await loadFromFile('devices.json', [
    {
      id: '1',
      name: 'Router-1',
      type: 'cisco_router',
      ip: '192.168.1.10',
      username: 'admin',
      password: 'admin',
      sshPort: 22,
      status: 'unknown',
      location: 'Main Office',
      model: 'Cisco ISR 4331',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Switch-1',
      type: 'cisco_switch',
      ip: '192.168.1.11',
      username: 'admin',
      password: 'admin',
      sshPort: 22,
      status: 'unknown',
      location: 'Main Office',
      model: 'Cisco Catalyst 2960',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Firewall-1',
      type: 'pfsense',
      ip: '192.168.1.12',
      username: 'admin',
      password: 'admin',
      sshPort: 22,
      status: 'unknown',
      location: 'DMZ',
      model: 'pfSense',
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function saveDevices(devices) {
  await saveToFile('devices.json', devices);
}

// VLAN management
export async function loadVlans() {
  return await loadFromFile('vlans.json', [
    { id: 100, name: 'Guest Network', status: 'active', devices: 24, subnet: '192.168.100.0/24', description: 'Guest user access' },
    { id: 200, name: 'Corporate', status: 'active', devices: 156, subnet: '10.0.200.0/24', description: 'Main corporate network' },
    { id: 300, name: 'DMZ', status: 'active', devices: 8, subnet: '10.0.300.0/24', description: 'Demilitarized zone' }
  ]);
}

export async function saveVlans(vlans) {
  await saveToFile('vlans.json', vlans);
}

// Firewall rules management
export async function loadFirewallRules() {
  return await loadFromFile('firewall_rules.json', [
    { 
      id: 1, 
      priority: 100, 
      name: 'Allow HTTP/HTTPS', 
      action: 'allow', 
      source: 'any', 
      destination: 'web-servers', 
      port: '80,443', 
      protocol: 'TCP',
      status: 'active',
      hits: 15420
    },
    { 
      id: 2, 
      priority: 200, 
      name: 'Block P2P Traffic', 
      action: 'deny', 
      source: 'internal', 
      destination: 'any', 
      port: '6881-6999', 
      protocol: 'TCP/UDP',
      status: 'active',
      hits: 892
    }
  ]);
}

export async function saveFirewallRules(rules) {
  await saveToFile('firewall_rules.json', rules);
}

// VPN tunnels management
export async function loadVpnTunnels() {
  return await loadFromFile('vpn_tunnels.json', [
    {
      id: '1',
      name: 'Site-B-Tunnel',
      type: 'site-to-site',
      localIP: '192.168.1.10',
      remoteIP: '203.0.113.50',
      status: 'up',
      bandwidth: '50 Mbps',
      latency: 25,
      uptime: '2d 14h',
      bytesIn: 1048576000,
      bytesOut: 524288000
    },
    {
      id: '2',
      name: 'Mobile-Users',
      type: 'remote-access',
      localIP: '192.168.1.10',
      remoteIP: '0.0.0.0/0',
      status: 'up',
      bandwidth: '100 Mbps',
      latency: 15,
      uptime: '5d 8h',
      bytesIn: 2097152000,
      bytesOut: 1048576000
    }
  ]);
}

export async function saveVpnTunnels(tunnels) {
  await saveToFile('vpn_tunnels.json', tunnels);
}

// User management
export async function loadUsers() {
  const bcrypt = (await import('bcryptjs')).default;
  const defaultUsers = [
    {
      id: '1',
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      email: 'admin@netops.local',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      username: 'operator',
      password: await bcrypt.hash('operator', 10),
      email: 'operator@netops.local',
      role: 'operator',
      createdAt: new Date().toISOString()
    }
  ];
  
  return await loadFromFile('users.json', defaultUsers);
}

export async function saveUsers(users) {
  await saveToFile('users.json', users);
}

// Configuration and settings
export async function loadConfig() {
  return await loadFromFile('config.json', {
    gns3: {
      server: process.env.GNS3_SERVER_URL || 'http://127.0.0.1:3080',
      username: process.env.GNS3_USERNAME || 'admin',
      password: process.env.GNS3_PASSWORD || 'admin'
    },
    devices: {
      defaultUsername: process.env.DEVICE_USERNAME || 'admin',
      defaultPassword: process.env.DEVICE_PASSWORD || 'admin',
      sshTimeout: parseInt(process.env.SSH_TIMEOUT) || 10000
    },
    monitoring: {
      pollInterval: parseInt(process.env.DEVICE_POLL_INTERVAL) || 300,
      retryAttempts: 3
    }
  });
}

export async function saveConfig(config) {
  await saveToFile('config.json', config);
}

// Logging
export async function logActivity(level, message, metadata = {}) {
  await ensureDirectories();
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata
  };
  
  const logPath = path.join(LOGS_DIR, `app.${new Date().toISOString().split('T')[0]}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  await fs.appendFile(logPath, logLine);
}

// Initialize storage on module load
ensureDirectories();