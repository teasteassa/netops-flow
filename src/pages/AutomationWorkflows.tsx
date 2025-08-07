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
  Workflow,
  Play,
  Pause,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

const workflows = [
  { 
    id: 1, 
    name: "Daily Backup Routine", 
    description: "Automated configuration backup for all devices",
    status: "active",
    trigger: "schedule", 
    schedule: "Daily at 2:00 AM",
    lastRun: "2024-01-07 02:00",
    nextRun: "2024-01-08 02:00",
    executions: 156,
    successRate: 98.7
  },
  { 
    id: 2, 
    name: "Security Alert Response", 
    description: "Automatically block suspicious IPs and notify security team",
    status: "active",
    trigger: "event", 
    schedule: "On security alert",
    lastRun: "2024-01-07 14:30",
    nextRun: "Event-driven",
    executions: 23,
    successRate: 100
  },
  { 
    id: 3, 
    name: "New Employee Onboarding", 
    description: "Create VLAN access and VPN credentials for new hires",
    status: "paused",
    trigger: "manual", 
    schedule: "Manual trigger",
    lastRun: "2024-01-05 10:15",
    nextRun: "Manual",
    executions: 8,
    successRate: 87.5
  },
  { 
    id: 4, 
    name: "Bandwidth Monitoring", 
    description: "Monitor network usage and alert on threshold breach",
    status: "active",
    trigger: "schedule", 
    schedule: "Every 5 minutes",
    lastRun: "2024-01-07 15:25",
    nextRun: "2024-01-07 15:30",
    executions: 2880,
    successRate: 99.9
  }
]

const executionHistory = [
  {
    id: 1,
    workflowName: "Daily Backup Routine",
    startTime: "2024-01-07 02:00:00",
    endTime: "2024-01-07 02:15:34",
    duration: "15m 34s",
    status: "success",
    result: "12 devices backed up successfully"
  },
  {
    id: 2,
    workflowName: "Security Alert Response",
    startTime: "2024-01-07 14:30:12",
    endTime: "2024-01-07 14:30:28",
    duration: "16s",
    status: "success",
    result: "IP 203.0.113.45 blocked, security team notified"
  },
  {
    id: 3,
    workflowName: "Bandwidth Monitoring",
    startTime: "2024-01-07 15:25:00",
    endTime: "2024-01-07 15:25:03",
    duration: "3s",
    status: "success",
    result: "Usage: 67% of capacity, within normal range"
  },
  {
    id: 4,
    workflowName: "Daily Backup Routine",
    startTime: "2024-01-06 02:00:00",
    endTime: "2024-01-06 02:18:45",
    duration: "18m 45s",
    status: "warning",
    result: "11 of 12 devices backed up, Switch-Floor-02 timeout"
  },
  {
    id: 5,
    workflowName: "New Employee Onboarding",
    startTime: "2024-01-05 10:15:22",
    endTime: "2024-01-05 10:16:05",
    duration: "43s",
    status: "failed",
    result: "VLAN creation failed: insufficient permissions"
  }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active": return "default"
    case "paused": return "secondary"
    case "error": return "destructive"
    default: return "outline"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success"
    case "paused": return "bg-warning"
    case "error": return "bg-destructive"
    default: return "bg-muted"
  }
}

const getExecutionStatusIcon = (status: string) => {
  switch (status) {
    case "success": return <CheckCircle className="w-4 h-4 text-success" />
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />
    case "failed": return <XCircle className="w-4 h-4 text-destructive" />
    default: return <Clock className="w-4 h-4 text-muted-foreground" />
  }
}

const getExecutionStatusVariant = (status: string) => {
  switch (status) {
    case "success": return "default"
    case "warning": return "secondary"
    case "failed": return "destructive"
    default: return "outline"
  }
}

export default function AutomationWorkflows() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeWorkflows = workflows.filter(w => w.status === "active").length
  const totalExecutions = workflows.reduce((sum, w) => sum + w.executions, 0)
  const avgSuccessRate = workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length

  return (
    <Layout title="Automation Workflows" subtitle="Automated network operations and orchestration">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Manager
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold">{workflows.length}</p>
                </div>
                <Workflow className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">{activeWorkflows}</p>
                </div>
                <Play className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Executions</p>
                  <p className="text-2xl font-bold">{totalExecutions.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Management Tabs */}
        <Tabs defaultValue="workflows" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="execution-history">Execution History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Automation Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkflows.map((workflow) => (
                      <TableRow key={workflow.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {workflow.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {workflow.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(workflow.status)}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(workflow.status)}`} />
                            {workflow.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {workflow.trigger}
                        </TableCell>
                        <TableCell className="text-sm">
                          {workflow.schedule}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {workflow.lastRun}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {workflow.nextRun}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <span className={workflow.successRate >= 95 ? "text-success" : workflow.successRate >= 90 ? "text-warning" : "text-destructive"}>
                            {workflow.successRate}%
                          </span>
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
                                <Play className="w-4 h-4 mr-2" />
                                Run Now
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause/Resume
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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
          
          <TabsContent value="execution-history">
            <Card>
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executionHistory.map((execution) => (
                      <TableRow key={execution.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {execution.workflowName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {execution.startTime}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {execution.duration}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getExecutionStatusIcon(execution.status)}
                            <Badge variant={getExecutionStatusVariant(execution.status)}>
                              {execution.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-md">
                          {execution.result}
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