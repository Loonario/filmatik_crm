'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronsUpDown, Users, Car, Truck, Caravan, Video, MapPin, Box, Shirt, UserSquare2, Calendar, DollarSign, Film } from 'lucide-react'
import { cn } from "@/lib/utils"
import { ProjectWithAccess } from "./project-layout"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarRail,
} from '@/components/ui/sidebar'
import {Separator} from "@/components/ui/separator"
import { Project } from '@/lib/api'
import { SidebarProjectMenu } from "@/types"
import { sidebarItems, bottomItems } from "@/consts"
import {Production} from "@/lib/api-productions"

interface ProjectSidebarProps {
  onDropdownOpen: (open: boolean) => void;
  projects: ProjectWithAccess[];
  currentProject: ProjectWithAccess | null;
  setCurrentProject: (project :ProjectWithAccess) => void;
  sidebarMenuItems: SidebarProjectMenu[];
  currentCategory: SidebarProjectMenu;
  setCurrentCategory: (category :SidebarProjectMenu) => void;
  production: Production | null;
}

export function ProjectSidebar({ 
  onDropdownOpen,
  projects,
  currentProject,
  setCurrentProject,
  sidebarMenuItems,
  currentCategory,
  setCurrentCategory ,
  production
}: ProjectSidebarProps) {
  const { state } = useSidebar()

  const handleCategoryClick = (category: SidebarProjectMenu) => {
    setCurrentCategory(category)
  }

  const handleProjectChange = (project: ProjectWithAccess) => {
    setCurrentProject(project)
  }

  return (
    <Sidebar 
      className="border-r fixed top-0 left-16 h-full z-30" 
      collapsible="icon"
    >
      <SidebarHeader className="h-13 px-2 flex items-center">
        <DropdownMenu onOpenChange={onDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className='flex items-center'>
                <Film className="mr-2 h-4 w-4" />
                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {currentProject?.project.name || 'Select Project'}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56"
            side="bottom"
            align="start"
          >
            <DropdownMenuLabel>{production ? production.name : "My Projects"}</DropdownMenuLabel>
            <Separator />
            {projects.map((project) => (
              <DropdownMenuItem 
                key={project.project.id} 
                onSelect={() => handleProjectChange(project)}
                className= {project.project.id === currentProject?.project.id ? "bg-secondary" : "bg-transparent" + "w-full"}
              >
                <Button
                variant={"ghost"}
                className='w-full text-left justify-start'>
                {project.project.name}
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            // Only show items that are in the allowed sidebarMenuItems
            sidebarMenuItems.includes(item.value as SidebarProjectMenu) && (
              <Button
                key={item.name}
                variant={item.value === currentCategory ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCategoryClick(item.value as SidebarProjectMenu)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
              </Button>
            )
          ))}
        </div>
        <div className="my-4 h-[1px] bg-border" />
        <div className="space-y-1 py-2">
          {bottomItems.map((item) => (
            // Only show items that are in the allowed sidebarMenuItems
            sidebarMenuItems.includes(item.value as SidebarProjectMenu) && (
              <Button
                key={item.name}
                variant={item.value === currentCategory ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCategoryClick(item.value as SidebarProjectMenu)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
              </Button>
            )
          ))}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}