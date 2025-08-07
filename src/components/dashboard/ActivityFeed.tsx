import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Activity
} from "lucide-react"

const activities = [
  {
    id: 1,
    action: "VLAN Configuration Updated",
    description: "VLAN 100 (Guest Network) rules modified on Switch-01",
    time: "2 minutes ago",
    status: "success",
    user: "admin@company.com"
  },
  {
    id: 2,
    action: "Firewall Rule Deployed",
    description: "New security policy applied to DMZ zone",
    time: "15 minutes ago",
    status: "success",
    user: "security.admin"
  },
  {
    id: 3,
    action: "VPN Connection Failed",
    description: "Site-to-site tunnel to Branch Office dropped",
    time: "32 minutes ago",
    status: "error",
    user: "system"
  },
  {
    id: 4,
    action: "Device Health Check",
    description: "Router-Core-01 CPU usage exceeding threshold (85%)",
    time: "1 hour ago",
    status: "warning",
    user: "monitoring"
  },
  {
    id: 5,
    action: "Backup Completed",
    description: "Configuration backup successful for 12 devices",
    time: "2 hours ago",
    status: "success",
    user: "backup.service"
  },
  {
    id: 6,
    action: "User Access Granted",
    description: "Remote VPN access provisioned for john.doe@company.com",
    time: "3 hours ago",
    status: "info",
    user: "admin@company.com"
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-success" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-warning" />
    case "error":
      return <XCircle className="w-4 h-4 text-destructive" />
    case "info":
      return <Clock className="w-4 h-4 text-primary" />
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "success":
      return "default"
    case "warning":
      return "secondary"
    case "error":
      return "destructive"
    case "info":
      return "outline"
    default:
      return "secondary"
  }
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-foreground leading-none">
                      {activity.action}
                    </h4>
                    <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      by {activity.user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}