'use client'

import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { SidebarGlobalComponent } from '@/components/global/sidebarGlobal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
<SidebarProvider open={false} defaultOpen={false}>
        <div className="flex h-screen overflow-hidden w-full">
          <SidebarGlobalComponent />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
        </SidebarProvider>
        <Toaster />
    </>
  )
}

