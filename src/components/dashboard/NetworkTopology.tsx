import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Router, 
  Wifi, 
  Server, 
  Shield, 
  Zap,
  ExternalLink
} from "lucide-react"

const networkDevices = [
  { id: 1, name: "Core Router", type: "router", status: "online", connections: 8, x: 50, y: 30 },
  { id: 2, name: "Firewall-01", type: "firewall", status: "online", connections: 4, x: 80, y: 20 },
  { id: 3, name: "Switch-01", type: "switch", status: "online", connections: 12, x: 20, y: 60 },
  { id: 4, name: "Switch-02", type: "switch", status: "warning", connections: 8, x: 80, y: 60 },
  { id: 5, name: "AP-Guest", type: "access-point", status: "online", connections: 3, x: 15, y: 85 },
  { id: 6, name: "Server-01", type: "server", status: "online", connections: 2, x: 85, y: 85 },
]

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "router": return Router
    case "firewall": return Shield
    case "switch": return Zap
    case "access-point": return Wifi
    case "server": return Server
    default: return Router
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

export function NetworkTopology() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Network Topology</CardTitle>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Full View
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 bg-card border rounded-lg overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Network connections */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Core connections */}
            <line 
              x1="50%" y1="30%" 
              x2="80%" y2="20%" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
              className="opacity-60"
            />
            <line 
              x1="50%" y1="30%" 
              x2="20%" y2="60%" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
              className="opacity-60"
            />
            <line 
              x1="50%" y1="30%" 
              x2="80%" y2="60%" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
              className="opacity-60"
            />
            <line 
              x1="20%" y1="60%" 
              x2="15%" y2="85%" 
              stroke="hsl(var(--accent))" 
              strokeWidth="2"
              className="opacity-60"
            />
            <line 
              x1="80%" y1="60%" 
              x2="85%" y2="85%" 
              stroke="hsl(var(--accent))" 
              strokeWidth="2"
              className="opacity-60"
            />
          </svg>
          
          {/* Network devices */}
          {networkDevices.map((device) => {
            const Icon = getDeviceIcon(device.type)
            return (
              <div
                key={device.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full border-2 border-border flex items-center justify-center bg-card shadow-lg transition-all duration-200 group-hover:scale-110 ${getStatusColor(device.status)}/10`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(device.status)}`} />
                  
                  {/* Device info tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg min-w-32">
                      <p className="font-medium text-sm text-foreground">{device.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{device.type}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant={device.status === "online" ? "default" : "secondary"} className="text-xs">
                          {device.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {device.connections} conn.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Offline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}