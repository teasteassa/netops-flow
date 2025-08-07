import { NodeSSH } from 'node-ssh';
import { loadDevices, loadConfig, logActivity } from './fileStorage.js';

const connectionPool = new Map();

export async function getDeviceConnection(deviceId) {
  // Check if connection already exists in pool
  if (connectionPool.has(deviceId)) {
    const conn = connectionPool.get(deviceId);
    if (conn.ssh && conn.ssh.connection) {
      return conn;
    } else {
      connectionPool.delete(deviceId);
    }
  }
  
  const devices = await loadDevices();
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new Error(`Device ${deviceId} not found`);
  }
  
  const ssh = new NodeSSH();
  const config = await loadConfig();
  
  try {
    await ssh.connect({
      host: device.ip,
      username: device.username || config.devices.defaultUsername,
      password: device.password || config.devices.defaultPassword,
      port: device.sshPort || 22,
      readyTimeout: config.devices.sshTimeout || 10000,
      algorithms: {
        kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group14-sha1'],
        cipher: ['aes128-cbc', 'aes192-cbc', 'aes256-cbc'],
        serverHostKey: ['ssh-rsa', 'ssh-dss'],
        hmac: ['hmac-sha2-256', 'hmac-sha2-512', 'hmac-sha1']
      }
    });
    
    const connection = {
      ssh,
      device,
      lastUsed: Date.now()
    };
    
    connectionPool.set(deviceId, connection);
    
    await logActivity('info', `SSH connection established to ${device.name} (${device.ip})`);
    
    return connection;
    
  } catch (error) {
    await logActivity('error', `Failed to connect to ${device.name} (${device.ip})`, { error: error.message });
    throw new Error(`Failed to connect to device ${device.name}: ${error.message}`);
  }
}

export async function executeDeviceCommand(deviceId, command, options = {}) {
  try {
    const connection = await getDeviceConnection(deviceId);
    const { ssh, device } = connection;
    
    await logActivity('info', `Executing command on ${device.name}`, { command });
    
    // Handle different device types
    let fullCommand = command;
    
    if (device.type === 'cisco_router' || device.type === 'cisco_switch') {
      // For Cisco devices, we might need to enter enable mode
      if (command.includes('configure') || command.includes('show')) {
        // Commands that might need enable mode
        fullCommand = command;
      }
    }
    
    const result = await ssh.execCommand(fullCommand, {
      execOptions: { pty: true },
      ...options
    });
    
    // Update last used timestamp
    connection.lastUsed = Date.now();
    
    await logActivity('info', `Command executed successfully on ${device.name}`, {
      command,
      exitCode: result.code,
      outputLength: result.stdout.length
    });
    
    return {
      success: result.code === 0,
      output: result.stdout,
      error: result.stderr,
      exitCode: result.code,
      command,
      deviceId,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    await logActivity('error', `Command execution failed`, {
      deviceId,
      command,
      error: error.message
    });
    
    throw new Error(`Command execution failed: ${error.message}`);
  }
}

export async function executeDeviceCommands(deviceId, commands, options = {}) {
  const results = [];
  
  for (const command of commands) {
    try {
      const result = await executeDeviceCommand(deviceId, command, options);
      results.push(result);
      
      // If a command fails and stopOnError is true, stop executing
      if (!result.success && options.stopOnError) {
        break;
      }
    } catch (error) {
      results.push({
        success: false,
        output: '',
        error: error.message,
        command,
        deviceId,
        timestamp: new Date().toISOString()
      });
      
      if (options.stopOnError) {
        break;
      }
    }
  }
  
  return results;
}

export async function testDeviceConnectivity(deviceId) {
  try {
    const result = await executeDeviceCommand(deviceId, 'show version');
    return {
      connected: result.success,
      latency: 0, // TODO: Measure actual latency
      lastSeen: new Date().toISOString(),
      deviceInfo: parseDeviceInfo(result.output)
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      lastSeen: new Date().toISOString()
    };
  }
}

export function parseDeviceInfo(showVersionOutput) {
  // Parse device information from 'show version' output
  const info = {
    hostname: '',
    model: '',
    ios: '',
    uptime: '',
    serialNumber: ''
  };
  
  const lines = showVersionOutput.split('\n');
  
  for (const line of lines) {
    if (line.includes('hostname')) {
      const match = line.match(/hostname\s+(\S+)/i);
      if (match) info.hostname = match[1];
    } else if (line.includes('Cisco') && line.includes('processor')) {
      info.model = line.trim();
    } else if (line.includes('IOS') || line.includes('Version')) {
      info.ios = line.trim();
    } else if (line.includes('uptime')) {
      info.uptime = line.trim();
    } else if (line.includes('Processor board ID')) {
      const match = line.match(/Processor board ID\s+(\S+)/);
      if (match) info.serialNumber = match[1];
    }
  }
  
  return info;
}

// Clean up old connections periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 10 * 60 * 1000; // 10 minutes
  
  for (const [deviceId, connection] of connectionPool.entries()) {
    if (now - connection.lastUsed > maxAge) {
      try {
        connection.ssh.dispose();
      } catch (error) {
        // Ignore cleanup errors
      }
      connectionPool.delete(deviceId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Cleanup on process exit
process.on('exit', () => {
  for (const connection of connectionPool.values()) {
    try {
      connection.ssh.dispose();
    } catch (error) {
      // Ignore cleanup errors
    }
  }
});