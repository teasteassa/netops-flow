import express from 'express';
import { executeDeviceCommand } from '../utils/deviceConnector.js';
import { loadVlans, saveVlans } from '../utils/fileStorage.js';

const router = express.Router();

// Get all VLANs from devices
router.get('/', async (req, res) => {
  try {
    // Load VLANs from file storage and merge with device data
    const storedVlans = await loadVlans();
    
    // TODO: Query actual devices for VLAN information
    // For now, return stored VLANs with enriched data
    
    res.json(storedVlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get VLANs from specific device
router.get('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Execute VLAN show command
    const result = await executeDeviceCommand(deviceId, 'show vlan brief');
    
    // Parse VLAN output
    const vlans = parseVlanOutput(result.output);
    
    res.json({
      deviceId,
      vlans,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create VLAN on device
router.post('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { vlanId, name, description } = req.body;
    
    // Validate input
    if (!vlanId || !name) {
      return res.status(400).json({ error: 'VLAN ID and name are required' });
    }
    
    // Create VLAN configuration commands
    const commands = [
      'configure terminal',
      `vlan ${vlanId}`,
      `name ${name}`,
      description ? `description ${description}` : null,
      'exit',
      'exit',
      'write memory'
    ].filter(Boolean);
    
    // Execute commands
    const results = [];
    for (const command of commands) {
      const result = await executeDeviceCommand(deviceId, command);
      results.push(result);
    }
    
    // Update local storage
    const vlans = await loadVlans();
    const newVlan = {
      id: parseInt(vlanId),
      name,
      description: description || '',
      status: 'active',
      devices: 0,
      subnet: '',
      deviceId,
      createdAt: new Date().toISOString()
    };
    
    vlans.push(newVlan);
    await saveVlans(vlans);
    
    res.status(201).json({
      success: true,
      vlan: newVlan,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete VLAN from device
router.delete('/device/:deviceId/vlan/:vlanId', async (req, res) => {
  try {
    const { deviceId, vlanId } = req.params;
    
    // Create VLAN deletion commands
    const commands = [
      'configure terminal',
      `no vlan ${vlanId}`,
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
    const vlans = await loadVlans();
    const updatedVlans = vlans.filter(v => !(v.id === parseInt(vlanId) && v.deviceId === deviceId));
    await saveVlans(updatedVlans);
    
    res.json({
      success: true,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign port to VLAN
router.post('/device/:deviceId/port-assignment', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { interface: interfaceName, vlanId, mode } = req.body;
    
    // Validate input
    if (!interfaceName || !vlanId || !mode) {
      return res.status(400).json({ error: 'Interface, VLAN ID, and mode are required' });
    }
    
    // Create port assignment commands
    const commands = [
      'configure terminal',
      `interface ${interfaceName}`,
      mode === 'access' ? `switchport mode access` : `switchport mode trunk`,
      mode === 'access' ? `switchport access vlan ${vlanId}` : `switchport trunk allowed vlan ${vlanId}`,
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
    
    res.json({
      success: true,
      interface: interfaceName,
      vlanId,
      mode,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function parseVlanOutput(output) {
  // Parse Cisco VLAN brief output
  const lines = output.split('\n');
  const vlans = [];
  
  for (const line of lines) {
    // Look for VLAN lines (simplified parsing)
    const match = line.match(/^(\d+)\s+(\S+)\s+(\S+)\s+(.*)/);
    if (match) {
      vlans.push({
        id: parseInt(match[1]),
        name: match[2],
        status: match[3].toLowerCase(),
        ports: match[4].trim().split(/\s*,\s*/).filter(p => p)
      });
    }
  }
  
  return vlans;
}

export default router;