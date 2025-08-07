import { useState, useEffect } from 'react';

const API_BASE = '/api';

interface ApiResponse<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T = any>(endpoint: string, options?: RequestInit): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}

export async function apiCall<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // GNS3 Integration
  gns3: {
    getStatus: () => apiCall('/gns3/status'),
    getProjects: () => apiCall('/gns3/projects'),
    getTopology: (projectId: string) => apiCall(`/gns3/projects/${projectId}/topology`),
  },

  // Device Management
  devices: {
    getAll: () => apiCall('/devices'),
    getById: (id: string) => apiCall(`/devices/${id}`),
    create: (device: any) => apiCall('/devices', { method: 'POST', body: JSON.stringify(device) }),
    update: (id: string, device: any) => apiCall(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(device) }),
    delete: (id: string) => apiCall(`/devices/${id}`, { method: 'DELETE' }),
    test: (id: string) => apiCall(`/devices/${id}/test`, { method: 'POST' }),
    execute: (id: string, command: string) => apiCall(`/devices/${id}/execute`, { 
      method: 'POST', 
      body: JSON.stringify({ command }) 
    }),
    getConfig: (id: string) => apiCall(`/devices/${id}/config`),
    getInterfaces: (id: string) => apiCall(`/devices/${id}/interfaces`),
  },

  // VLAN Management
  vlans: {
    getAll: () => apiCall('/vlans'),
    getByDevice: (deviceId: string) => apiCall(`/vlans/device/${deviceId}`),
    create: (deviceId: string, vlan: any) => apiCall(`/vlans/device/${deviceId}`, { 
      method: 'POST', 
      body: JSON.stringify(vlan) 
    }),
    delete: (deviceId: string, vlanId: string) => apiCall(`/vlans/device/${deviceId}/vlan/${vlanId}`, { 
      method: 'DELETE' 
    }),
    assignPort: (deviceId: string, assignment: any) => apiCall(`/vlans/device/${deviceId}/port-assignment`, { 
      method: 'POST', 
      body: JSON.stringify(assignment) 
    }),
  },

  // Firewall Management
  firewall: {
    getRules: () => apiCall('/firewall/rules'),
    getRulesByDevice: (deviceId: string) => apiCall(`/firewall/device/${deviceId}/rules`),
    createRule: (deviceId: string, rule: any) => apiCall(`/firewall/device/${deviceId}/rules`, { 
      method: 'POST', 
      body: JSON.stringify(rule) 
    }),
    updateRule: (deviceId: string, ruleId: string, updates: any) => apiCall(`/firewall/device/${deviceId}/rules/${ruleId}`, { 
      method: 'PUT', 
      body: JSON.stringify(updates) 
    }),
    deleteRule: (deviceId: string, ruleId: string) => apiCall(`/firewall/device/${deviceId}/rules/${ruleId}`, { 
      method: 'DELETE' 
    }),
    getStats: (deviceId: string) => apiCall(`/firewall/device/${deviceId}/stats`),
  },

  // VPN Management
  vpn: {
    getTunnels: () => apiCall('/vpn/tunnels'),
    getStatus: (deviceId: string) => apiCall(`/vpn/device/${deviceId}/status`),
    createTunnel: (deviceId: string, tunnel: any) => apiCall(`/vpn/device/${deviceId}/tunnels`, { 
      method: 'POST', 
      body: JSON.stringify(tunnel) 
    }),
    testTunnel: (deviceId: string, tunnelId: string) => apiCall(`/vpn/device/${deviceId}/tunnels/${tunnelId}/test`, { 
      method: 'POST' 
    }),
    getTunnelStats: (deviceId: string, tunnelId: string) => apiCall(`/vpn/device/${deviceId}/tunnels/${tunnelId}/stats`),
    deleteTunnel: (deviceId: string, tunnelId: string) => apiCall(`/vpn/device/${deviceId}/tunnels/${tunnelId}`, { 
      method: 'DELETE' 
    }),
  },

  // Authentication
  auth: {
    login: (credentials: { username: string; password: string }) => apiCall('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(credentials) 
    }),
    register: (user: any) => apiCall('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify(user) 
    }),
    getProfile: () => apiCall('/auth/me'),
  },

  // Dashboard
  dashboard: {
    getStats: () => apiCall('/dashboard/stats'),
    getActivity: () => apiCall('/dashboard/activity'),
    getTopology: () => apiCall('/dashboard/topology'),
    getHealth: () => apiCall('/dashboard/health'),
  },
};