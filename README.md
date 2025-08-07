# GNS3 Network Automation Platform

A comprehensive network automation platform with direct GNS3 integration for managing VLAN, Firewall, and VPN configurations in real network labs.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- GNS3 server running on `http://127.0.0.1:3080`
- Network devices with SSH access configured

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your GNS3 and device settings
```

3. **Start GNS3 Lab:**
   - Open GNS3 GUI
   - Create/load your network topology
   - Ensure devices have management IPs (192.168.1.x)
   - Configure SSH access on devices

4. **Run the application:**
```bash
# Development mode (frontend + backend)
npm run dev:full

# Or run separately:
npm run dev        # Frontend only (port 8080)
npm run dev:server # Backend only (port 3001)
```

## 🔧 Key Features

### Real Device Integration
- Direct SSH connections to GNS3 devices
- Execute CLI commands on real routers/switches
- File-based JSON storage (no database required)
- Live device status monitoring

### Network Automation
- **VLAN Management**: Create/delete VLANs on physical switches
- **Firewall Rules**: Configure ACLs with real-time statistics
- **VPN Tunnels**: Site-to-site IPSec automation
- **Device Management**: Configuration backup and restore

### Modern UI
- React + TypeScript frontend
- Dark theme with network-inspired design
- Real-time WebSocket updates
- Responsive dashboard with live metrics

## 📡 Architecture

### Backend (Express.js)
- REST API with device SSH connections
- JSON file storage in `/data` folder
- GNS3 server integration
- JWT authentication

### Default Setup
- Management IPs: 192.168.1.10-13
- Default credentials: admin/admin
- Supports Cisco IOS and pfSense devices

## 🛠️ Environment Variables

```bash
GNS3_SERVER_URL=http://127.0.0.1:3080
DEVICE_USERNAME=admin
DEVICE_PASSWORD=admin
PORT=3001
JWT_SECRET=your-secret-key
```

## 📈 Usage

1. Add your GNS3 devices in Device Management
2. Test SSH connectivity
3. Create VLANs through the web interface
4. Configure firewall rules
5. Setup VPN tunnels between sites
6. Monitor real-time network status

Perfect for network labs, training environments, and automated GNS3 topologies!
