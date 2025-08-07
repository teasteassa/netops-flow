import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Settings,
  Network
} from "lucide-react"

const vlans = [
  { id: 100, name: "Guest Network", status: "active", devices: 24, subnet: "192.168.100.0/24", description: "Guest user access" },
  { id: 200, name: "Corporate", status: "active", devices: 156, subnet: "10.0.200.0/24", description: "Main corporate network" },
  { id: 300, name: "DMZ", status: "active", devices: 8, subnet: "10.0.300.0/24", description: "Demilitarized zone" },
  { id: 400, name: "Management", status: "active", devices: 12, subnet: "10.0.400.0/24", description: "Network management" },
  { id: 500, name: "VoIP", status: "warning", devices: 45, subnet: "10.0.500.0/24", description: "Voice over IP services" },
  { id: 600, name: "IoT Devices", status: "active", devices: 89, subnet: "10.0.600.0/24", description: "Internet of Things" },
  { id: 700, name: "Development", status: "inactive", devices: 0, subnet: "10.0.700.0/24", description: "Development environment" },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active": return "default"
    case "warning": return "secondary" 
    case "inactive": return "outline"
    default: return "secondary"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "text-success"
    case "warning": return "text-warning"
    case "inactive": return "text-muted-foreground"
    default: return "text-muted-foreground"
  }
}

export default function VlanManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredVlans = vlans.filter(vlan => 
    vlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vlan.id.toString().includes(searchTerm) ||
    vlan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout title="VLAN Management" subtitle="Configure and monitor virtual local area networks">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VLANs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create VLAN
            </Button>
          </div>
        </div>

        {/* VLAN Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total VLANs</p>
                  <p className="text-2xl font-bold">{vlans.length}</p>
                </div>
                <Network className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {vlans.filter(v => v.status === "active").length}
                  </p>
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
                  <p className="text-2xl font-bold text-warning">
                    {vlans.filter(v => v.status === "warning").length}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold">
                    {vlans.reduce((sum, vlan) => sum + vlan.devices, 0)}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VLAN Table */}
        <Card>
          <CardHeader>
            <CardTitle>VLAN Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>VLAN ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subnet</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVlans.map((vlan) => (
                  <TableRow key={vlan.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">
                      {vlan.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {vlan.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(vlan.status)}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(vlan.status).replace('text-', 'bg-')}`} />
                        {vlan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {vlan.subnet}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-8 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {vlan.devices}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vlan.description}
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
                            Edit VLAN
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Configure Ports
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete VLAN
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
      </div>
    </Layout>
  )
}