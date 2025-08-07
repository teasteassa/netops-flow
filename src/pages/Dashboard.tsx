import { Layout } from "@/components/layout/Layout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { NetworkTopology } from "@/components/dashboard/NetworkTopology"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { 
  Network, 
  Shield, 
  Router, 
  Activity,
  Users,
  AlertTriangle
} from "lucide-react"

export default function Dashboard() {
  return (
    <Layout title="Network Dashboard" subtitle="Real-time network monitoring and management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active VLANs"
            value={24}
            change="+2 from last week"
            changeType="positive"
            icon={Network}
            className="glow-primary"
          />
          <StatsCard
            title="Firewall Rules"
            value={156}
            change="3 pending review"
            changeType="neutral"
            icon={Shield}
          />
          <StatsCard
            title="Connected Devices"
            value={89}
            change="-5 since yesterday"
            changeType="negative"
            icon={Router}
          />
          <StatsCard
            title="Active VPN Users"
            value={12}
            change="+8 peak today"
            changeType="positive"
            icon={Users}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Topology - Takes 2 columns */}
          <NetworkTopology />
          
          {/* Activity Feed - Takes 1 column */}
          <ActivityFeed />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Network Alerts"
            value={3}
            change="2 critical, 1 warning"
            changeType="negative"
            icon={AlertTriangle}
          />
          <StatsCard
            title="Bandwidth Usage"
            value="2.4 GB/s"
            change="Peak: 3.1 GB/s"
            changeType="neutral"
            icon={Activity}
          />
          <StatsCard
            title="Uptime"
            value="99.9%"
            change="Last 30 days"
            changeType="positive"
            icon={Router}
          />
        </div>
      </div>
    </Layout>
  )
}