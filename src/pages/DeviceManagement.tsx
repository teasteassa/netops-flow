import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Server,
  Router,
  Wifi,
  Shield,
  Settings,
  Download,
  RefreshCw,
  Cpu,
  HardDrive,
  Activity
} from "lucide-react"

const devices = [
  { 
    id: 1, 
    name: "Core-Router-01", 
    type: "router", 
    ip: "192.168.1.1", 
    status: "online",
    model: "Cisco ASR 1001-X",
    location: "Server Room A",
    uptime: "45d 12h",
    cpu: 23,
    memory: 45,
    lastBackup: "2024-01-07 09:15"
  },
  { 
    id: 2, 
    name: "Firewall-Main", 
    type: "firewall", 
    ip: "192.168.1.2", 
    status: "online",
    model: "Fortinet FortiGate 100F",
    location: "Server Room A", 
    uptime: "38d 6h",
    cpu: 15,
    memory: 32,
    lastBackup: "2024-01-07 08:30"
  },
  { 
    id: 3, 
    name: "Switch-Floor-01", 
    type: "switch", 
    ip: "192.168.1.10", 
    status: "warning",
    model: "HP Aruba 2930F",
    location: "Floor 1 IDF",
    uptime: "12d 8h",
    cpu: 78,
    memory: 67,
    lastBackup: "2024-01-06 22:15"
  },
  { 
    id: 4, 
    name: "AP-Guest-Lobby", 
    type: "access-point", 
    ip: "192.168.1.50", 
    status: "online",
    model: "Ubiquiti UniFi 6 Pro",
    location: "Main Lobby",
    uptime: "25d 18h",
    cpu: 12,
    memory: 28,
    lastBackup: "2024-01-07 07:45"
  },
  { 
    id: 5, 
    name: "Switch-Floor-02", 
    type: "switch", 
    ip: "192.168.1.11", 
    status: "offline",
    model: "HP Aruba 2930F",
    location: "Floor 2 IDF",
    uptime: "0h",
    cpu: 0,
    memory: 0,
    lastBackup: "2024-01-05 14:22"
  }
]

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "router": return Router
    case "firewall": return Shield
    case "switch": return Server
    case "access-point": return Wifi
    default: return Server
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "online": return "default"
    case "warning": return "secondary"
    case "offline": return "destructive"
    default: return "outline"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "online": return "bg-success"
    case "warning": return "bg-warning"
    case "offline": return "bg-destructive"
    default: return "bg-muted"
  }
}

const getCpuColor = (cpu: number) => {
  if (cpu >= 80) return "text-destructive"
  if (cpu >= 60) return "text-warning"
  return "text-success"
}

export default function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ip.includes(searchTerm) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onlineDevices = devices.filter(device => device.status === "online").length
  const warningDevices = devices.filter(device => device.status === "warning").length
  const offlineDevices = devices.filter(device => device.status === "offline").length

  return (
    <Layout title="Device Management" subtitle="Monitor and configure network infrastructure">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Backup All
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </div>
        </div>

        {/* Device Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold">{devices.length}</p>
                </div>
                <Server className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-success">{onlineDevices}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warning</p>
                  <p className="text-2xl font-bold text-warning">{warningDevices}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-destructive">{offlineDevices}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Table */}
        <Card>
          <CardHeader>
            <CardTitle>Network Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Last Backup</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => {
                  const Icon = getDeviceIcon(device.type)
                  return (
                    <TableRow key={device.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{device.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {device.type.replace('-', ' ')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {device.ip}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(device.status)}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(device.status)}`} />
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {device.model}
                      </TableCell>
                      <TableCell className="text-sm">
                        {device.location}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {device.uptime}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Progress value={device.cpu} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getCpuColor(device.cpu)}`}>
                            {device.cpu}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Progress value={device.memory} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {device.memory}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {device.lastBackup}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Device
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Backup Config
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Device
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}