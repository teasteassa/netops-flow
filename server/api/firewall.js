import express from 'express';
import { executeDeviceCommand } from '../utils/deviceConnector.js';
import { loadFirewallRules, saveFirewallRules } from '../utils/fileStorage.js';

const router = express.Router();

// Get all firewall rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await loadFirewallRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get firewall rules from specific device
router.get('/device/:deviceId/rules', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Get device type to determine appropriate command
    const result = await executeDeviceCommand(deviceId, 'show access-lists');
    
    // Parse firewall rules
    const rules = parseFirewallRules(result.output);
    
    res.json({
      deviceId,
      rules,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create firewall rule
router.post('/device/:deviceId/rules', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { name, action, source, destination, port, protocol, priority } = req.body;
    
    // Validate input
    if (!name || !action || !source || !destination) {
      return res.status(400).json({ error: 'Name, action, source, and destination are required' });
    }
    
    // Create ACL commands based on device type
    const aclNumber = priority || 100;
    const commands = [
      'configure terminal',
      `access-list ${aclNumber} ${action} ${protocol || 'ip'} ${source} ${destination}${port ? ` eq ${port}` : ''}`,
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
    const rules = await loadFirewallRules();
    const newRule = {
      id: Date.now(),
      priority: aclNumber,
      name,
      action,
      source,
      destination,
      port: port || 'any',
      protocol: protocol || 'any',
      status: 'active',
      hits: 0,
      deviceId,
      createdAt: new Date().toISOString()
    };
    
    rules.push(newRule);
    await saveFirewallRules(rules);
    
    res.status(201).json({
      success: true,
      rule: newRule,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update firewall rule
router.put('/device/:deviceId/rules/:ruleId', async (req, res) => {
  try {
    const { deviceId, ruleId } = req.params;
    const { action } = req.body;
    
    // For now, support enable/disable actions
    const rules = await loadFirewallRules();
    const rule = rules.find(r => r.id === parseInt(ruleId) && r.deviceId === deviceId);
    
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    
    let commands = [];
    
    if (action === 'enable') {
      rule.status = 'active';
      // Commands to enable rule would go here
    } else if (action === 'disable') {
      rule.status = 'disabled';
      // Commands to disable rule would go here
    }
    
    await saveFirewallRules(rules);
    
    res.json({
      success: true,
      rule,
      commands
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete firewall rule
router.delete('/device/:deviceId/rules/:ruleId', async (req, res) => {
  try {
    const { deviceId, ruleId } = req.params;
    
    const rules = await loadFirewallRules();
    const rule = rules.find(r => r.id === parseInt(ruleId) && r.deviceId === deviceId);
    
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    
    // Create deletion commands
    const commands = [
      'configure terminal',
      `no access-list ${rule.priority}`,
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
    const updatedRules = rules.filter(r => r.id !== parseInt(ruleId));
    await saveFirewallRules(updatedRules);
    
    res.json({
      success: true,
      commands: commands,
      results: results
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get firewall statistics
router.get('/device/:deviceId/stats', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Execute statistics command
    const result = await executeDeviceCommand(deviceId, 'show access-list');
    
    // Parse statistics
    const stats = parseFirewallStats(result.output);
    
    res.json({
      deviceId,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function parseFirewallRules(output) {
  // Parse Cisco ACL output (simplified)
  const lines = output.split('\n');
  const rules = [];
  
  let currentAcl = null;
  
  for (const line of lines) {
    // Look for ACL definitions
    if (line.includes('access-list')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 4) {
        rules.push({
          id: Date.now() + Math.random(),
          priority: parts[1],
          action: parts[2],
          protocol: parts[3],
          source: parts[4] || 'any',
          destination: parts[5] || 'any',
          status: 'active'
        });
      }
    }
  }
  
  return rules;
}

function parseFirewallStats(output) {
  // Parse firewall statistics (simplified)
  const stats = {
    totalRules: 0,
    activeRules: 0,
    totalHits: 0,
    blockedConnections: 0
  };
  
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('access-list')) {
      stats.totalRules++;
      stats.activeRules++;
      
      // Look for hit counts
      const match = line.match(/\((\d+) matches\)/);
      if (match) {
        stats.totalHits += parseInt(match[1]);
      }
    }
  }
  
  return stats;
}

export default router;