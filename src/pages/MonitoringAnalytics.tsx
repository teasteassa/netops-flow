import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Wifi,
  Server,
  Download,
  Upload,
  Clock
} from "lucide-react"

const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "High CPU Usage",
    description: "Switch-Floor-01 CPU usage at 89% for 15 minutes",
    device: "Switch-Floor-01",
    time: "5 minutes ago",
    status: "active"
  },
  {
    id: 2,
    severity: "warning",
    title: "Bandwidth Threshold",
    description: "WAN link utilization exceeding 80%",
    device: "Core-Router-01",
    time: "12 minutes ago",
    status: "active"
  },
  {
    id: 3,
    severity: "info",
    title: "Backup Completed",
    description: "Daily configuration backup completed successfully",
    device: "All Devices",
    time: "2 hours ago",
    status: "resolved"
  },
  {
    id: 4,
    severity: "critical",
    title: "VPN Tunnel Down",
    description: "Site-to-site VPN to Branch Office LA disconnected",
    device: "VPN-Gateway",
    time: "3 hours ago",
    status: "acknowledged"
  }
]

const networkMetrics = [
  { name: "Total Bandwidth", value: "1.2 Gbps", trend: "up", change: "+15%" },
  { name: "Packet Loss", value: "0.02%", trend: "down", change: "-0.01%" },
  { name: "Average Latency", value: "12ms", trend: "stable", change: "0ms" },
  { name: "Active Sessions", value: "2,847", trend: "up", change: "+124" }
]

const topDevicesByTraffic = [
  { device: "Core-Router-01", traffic: 85, type: "router" },
  { device: "Switch-Floor-01", traffic: 67, type: "switch" },
  { device: "Firewall-Main", traffic: 56, type: "firewall" },
  { device: "Switch-Floor-02", traffic: 43, type: "switch" },
  { device: "AP-Guest-Lobby", traffic: 28, type: "access-point" }
]

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "critical": return "destructive"
    case "warning": return "secondary"
    case "info": return "default"
    default: return "outline"
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <XCircle className="w-4 h-4 text-destructive" />
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />
    case "info": return <CheckCircle className="w-4 h-4 text-success" />
    default: return <Activity className="w-4 h-4 text-muted-foreground" />
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <TrendingUp className="w-4 h-4 text-success" />
    case "down": return <TrendingDown className="w-4 h-4 text-destructive" />
    default: return <Activity className="w-4 h-4 text-muted-foreground" />
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up": return "text-success"
    case "down": return "text-destructive"
    default: return "text-muted-foreground"
  }
}

export default function MonitoringAnalytics() {
  const criticalAlerts = alerts.filter(alert => alert.severity === "critical" && alert.status === "active").length
  const warningAlerts = alerts.filter(alert => alert.severity === "warning" && alert.status === "active").length
  const totalActiveAlerts = alerts.filter(alert => alert.status === "active").length

  return (
    <Layout title="Monitoring & Analytics" subtitle="Real-time network performance and security insights">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Network Health</p>
                  <p className="text-2xl font-bold text-success">98.7%</p>
                </div>
                <Activity className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-warning">{totalActiveAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-destructive">{criticalAlerts}</p>
                </div>
                <XCircle className="w-8 h-8 text-destructive opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold">99.94%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Network Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {networkMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Alerts</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.filter(alert => alert.status === "active").map((alert) => (
                  <div key={alert.id} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm text-foreground leading-none">
                          {alert.title}
                        </h4>
                        <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Device: {alert.device}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Devices by Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Top Devices by Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDevicesByTraffic.map((device, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {device.type === "router" && <Server className="w-4 h-4 text-primary" />}
                        {device.type === "switch" && <Activity className="w-4 h-4 text-primary" />}
                        {device.type === "firewall" && <AlertTriangle className="w-4 h-4 text-primary" />}
                        {device.type === "access-point" && <Wifi className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{device.device}</p>
                        <p className="text-xs text-muted-foreground capitalize">{device.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-20">
                        <Progress value={device.traffic} className="h-2" />
                      </div>
                      <span className="text-sm font-medium min-w-0">{device.traffic}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bandwidth Usage Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Network Traffic Overview (Last 24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Bandwidth Usage Chart</p>
                <p className="text-sm text-muted-foreground">Real-time traffic visualization would be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}