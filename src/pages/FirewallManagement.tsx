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
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause
} from "lucide-react"

const firewallRules = [
  { 
    id: 1, 
    priority: 100, 
    name: "Allow HTTP/HTTPS", 
    action: "allow", 
    source: "any", 
    destination: "web-servers", 
    port: "80,443", 
    protocol: "TCP",
    status: "active",
    hits: 15420
  },
  { 
    id: 2, 
    priority: 200, 
    name: "Block P2P Traffic", 
    action: "deny", 
    source: "internal", 
    destination: "any", 
    port: "6881-6999", 
    protocol: "TCP/UDP",
    status: "active",
    hits: 892
  },
  { 
    id: 3, 
    priority: 150, 
    name: "VPN Access", 
    action: "allow", 
    source: "vpn-users", 
    destination: "internal", 
    port: "any", 
    protocol: "any",
    status: "active",
    hits: 3240
  },
  { 
    id: 4, 
    priority: 300, 
    name: "Guest Internet Only", 
    action: "allow", 
    source: "guest-vlan", 
    destination: "internet", 
    port: "80,443", 
    protocol: "TCP",
    status: "active",
    hits: 8750
  },
  { 
    id: 5, 
    priority: 50, 
    name: "Emergency Block", 
    action: "deny", 
    source: "192.168.100.50", 
    destination: "any", 
    port: "any", 
    protocol: "any",
    status: "disabled",
    hits: 0
  },
  { 
    id: 6, 
    priority: 400, 
    name: "SSH Management", 
    action: "allow", 
    source: "admin-network", 
    destination: "servers", 
    port: "22", 
    protocol: "TCP",
    status: "active",
    hits: 245
  }
]

const getActionColor = (action: string) => {
  switch (action) {
    case "allow": return "text-success"
    case "deny": return "text-destructive"
    case "log": return "text-warning"
    default: return "text-muted-foreground"
  }
}

const getActionVariant = (action: string) => {
  switch (action) {
    case "allow": return "default"
    case "deny": return "destructive"
    case "log": return "secondary"
    default: return "outline"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle className="w-4 h-4 text-success" />
    case "disabled": return <Pause className="w-4 h-4 text-muted-foreground" />
    case "error": return <XCircle className="w-4 h-4 text-destructive" />
    default: return <AlertTriangle className="w-4 h-4 text-warning" />
  }
}

export default function FirewallManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredRules = firewallRules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeRules = firewallRules.filter(rule => rule.status === "active").length
  const totalHits = firewallRules.reduce((sum, rule) => sum + rule.hits, 0)

  return (
    <Layout title="Firewall Management" subtitle="Security rules and policy configuration">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search firewall rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Deploy Changes
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>

        {/* Firewall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rules</p>
                  <p className="text-2xl font-bold">{firewallRules.length}</p>
                </div>
                <Shield className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                  <p className="text-2xl font-bold text-success">{activeRules}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hits</p>
                  <p className="text-2xl font-bold">{totalHits.toLocaleString()}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Threats Blocked</p>
                  <p className="text-2xl font-bold text-destructive">892</p>
                </div>
                <XCircle className="w-8 h-8 text-destructive opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Firewall Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hits</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules
                  .sort((a, b) => a.priority - b.priority)
                  .map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">
                      {rule.priority}
                    </TableCell>
                    <TableCell className="font-medium">
                      {rule.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionVariant(rule.action)}>
                        {rule.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {rule.source}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {rule.destination}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {rule.port}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rule.protocol}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(rule.status)}
                        <span className="text-sm capitalize">{rule.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {rule.hits.toLocaleString()}
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
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Enable/Disable
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Rule
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