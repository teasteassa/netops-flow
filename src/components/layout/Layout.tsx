import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 p-6 network-grid">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}