'use client'

import React, { useState } from 'react';
// import { ProjectSidebar } from '@/components/project/sidebar'
// import { SidebarProvider } from '@/components/ui/sidebar'

export default function ProjectLayout({
  

  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <SidebarProvider open={false} defaultOpen={false}>
    //   <div className="flex h-full w-full"> 
    //     <ProjectSidebar />
        // <main className="flex-1 w-full overflow-y-auto p-4">
        <div>
          {children}
        </div>
    //    /* </main>
    //  </SidebarProvider> */
  )
}