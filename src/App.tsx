import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VlanManagement from "./pages/VlanManagement";
import FirewallManagement from "./pages/FirewallManagement";
import VpnManagement from "./pages/VpnManagement";
import DeviceManagement from "./pages/DeviceManagement";
import AutomationWorkflows from "./pages/AutomationWorkflows";
import MonitoringAnalytics from "./pages/MonitoringAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vlans" element={<VlanManagement />} />
          <Route path="/firewall" element={<FirewallManagement />} />
          <Route path="/vpn" element={<VpnManagement />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/automation" element={<AutomationWorkflows />} />
          <Route path="/monitoring" element={<MonitoringAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
