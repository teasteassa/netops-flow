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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  GitBranch,
  User,
  Wifi,
  Download,
  Upload,
  MapPin,
  Clock
} from "lucide-react"

const siteToSiteVpns = [
  { 
    id: 1, 
    name: "Branch Office NY", 
    localEndpoint: "192.168.1.1", 
    remoteEndpoint: "203.0.113.10",
    status: "connected",
    uptime: "15d 4h 22m",
    throughput: { up: 45.2, down: 67.8 },
    latency: 23
  },
  { 
    id: 2, 
    name: "Data Center West", 
    localEndpoint: "192.168.1.1", 
    remoteEndpoint: "198.51.100.20",
    status: "connected",
    uptime: "8d 12h 15m",
    throughput: { up: 89.5, down: 156.3 },
    latency: 8
  },
  { 
    id: 3, 
    name: "Remote Office LA", 
    localEndpoint: "192.168.1.1", 
    remoteEndpoint: "203.0.113.30",
    status: "disconnected",
    uptime: "0m",
    throughput: { up: 0, down: 0 },
    latency: 0
  }
]

const remoteUsers = [
  {
    id: 1,
    username: "john.doe",
    email: "john.doe@company.com",
    status: "connected",
    ipAddress: "10.8.0.5",
    connectedSince: "2h 15m",
    bytesTransferred: "1.2 GB",
    location: "New York, USA"
  },
  {
    id: 2,
    username: "jane.smith",
    email: "jane.smith@company.com", 
    status: "connected",
    ipAddress: "10.8.0.8",
    connectedSince: "45m",
    bytesTransferred: "567 MB",
    location: "London, UK"
  },
  {
    id: 3,
    username: "bob.wilson",
    email: "bob.wilson@company.com",
    status: "disconnected",
    ipAddress: "-",
    connectedSince: "-",
    bytesTransferred: "0 B",
    location: "Last: Tokyo, JP"
  }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case "connected": return "default"
    case "disconnected": return "secondary"
    case "connecting": return "outline"
    default: return "secondary"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected": return "text-success"
    case "disconnected": return "text-destructive"
    case "connecting": return "text-warning"
    default: return "text-muted-foreground"
  }
}

export default function VpnManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const connectedSites = siteToSiteVpns.filter(vpn => vpn.status === "connected").length
  const connectedUsers = remoteUsers.filter(user => user.status === "connected").length

  return (
    <Layout title="VPN Management" subtitle="Site-to-site and remote access VPN monitoring">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VPN connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Tunnel
            </Button>
          </div>
        </div>

        {/* VPN Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Site-to-Site VPNs</p>
                  <p className="text-2xl font-bold">{siteToSiteVpns.length}</p>
                </div>
                <GitBranch className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Sites</p>
                  <p className="text-2xl font-bold text-success">{connectedSites}</p>
                </div>
                <Wifi className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remote Users</p>
                  <p className="text-2xl font-bold">{connectedUsers}</p>
                </div>
                <User className="w-8 h-8 text-accent opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Throughput</p>
                  <p className="text-2xl font-bold">224 Mbps</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Upload className="w-3 h-3" />
                    <span>134.7</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Download className="w-3 h-3" />
                    <span>224.1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VPN Tabs */}
        <Tabs defaultValue="site-to-site" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="site-to-site">Site-to-Site VPN</TabsTrigger>
            <TabsTrigger value="remote-access">Remote Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="site-to-site">
            <Card>
              <CardHeader>
                <CardTitle>Site-to-Site VPN Tunnels</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tunnel Name</TableHead>
                      <TableHead>Local Endpoint</TableHead>
                      <TableHead>Remote Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Throughput</TableHead>
                      <TableHead>Latency</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteToSiteVpns.map((vpn) => (
                      <TableRow key={vpn.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {vpn.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {vpn.localEndpoint}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {vpn.remoteEndpoint}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(vpn.status)}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(vpn.status).replace('text-', 'bg-')}`} />
                            {vpn.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {vpn.uptime}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Upload className="w-3 h-3 text-muted-foreground" />
                              <span>{vpn.throughput.up} Mbps</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Download className="w-3 h-3 text-muted-foreground" />
                              <span>{vpn.throughput.down} Mbps</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {vpn.latency > 0 ? `${vpn.latency}ms` : "-"}
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
                                Edit Tunnel
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download Config
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Tunnel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="remote-access">
            <Card>
              <CardHeader>
                <CardTitle>Remote Access Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Connected Since</TableHead>
                      <TableHead>Data Transfer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {remoteUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(user.status).replace('text-', 'bg-')}`} />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.ipAddress}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {user.connectedSince}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.bytesTransferred}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {user.location}
                          </div>
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
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Generate Config
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}