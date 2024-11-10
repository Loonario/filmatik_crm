'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronsUpDown, Users, Car, Truck, Caravan, Video, MapPin, Box, Shirt, UserSquare2, Calendar, DollarSign, Film } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarRail,
} from '@/components/ui/sidebar'

// Mock data for projects and productions
const projectsData = {
  myProjects: [
    { id: '1', name: 'Sci-Fi Epic' },
    { id: '2', name: 'Romantic Comedy' },
    { id: '3', name: 'Action Thriller' },
    { id: '4', name: 'Period Drama' },
  ],
  productions: [
    {
      name: 'Stellar Studios',
      projects: [
        { id: '5', name: 'Superhero Blockbuster' },
        { id: '6', name: 'Indie Documentary' },
      ],
    },
    {
      name: 'Moonlight Productions',
      projects: [
        { id: '7', name: 'Mystery Series' },
        { id: '8', name: 'Animated Feature' },
      ],
    },
  ],
}

const sidebarItems = [
  { name: 'Crew', icon: Users, href: '/project/crew' },
  { name: 'Vehicles', icon: Car, href: '/project/vehicles' },
  { name: 'Locations', icon: MapPin, href: '/project/locations' },
  { name: 'Props', icon: Box, href: '/project/props' },
  { name: 'Costumes', icon: Shirt, href: '/project/costumes' },
  { name: 'Cast', icon: UserSquare2, href: '/project/cast' },
  { name: 'Transportation', icon: Truck, href: '/project/transportation' },
  { name: 'Rental', icon: Video, href: '/project/rental' },
  { name: 'Special vehicles', icon: Caravan, href: '/project/special-vehicles' },
]

const bottomItems = [
  { name: 'Calendar', icon: Calendar, href: '/project/calendar' },
  { name: 'Budget', icon: DollarSign, href: '/project/budget' },
]

export function ProjectSidebar({onDropdownOpen}: any) {
  const [currentProject, setCurrentProject] = React.useState(projectsData.myProjects[0])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state } = useSidebar()

  const projectId = searchParams.get('id')
  const category = searchParams.get('category') || 'crew'

  const handleCategoryClick = (href: string) => {
    const category = href.split('/').pop()
    router.push(`/project?id=${projectId}&category=${category}`)
  }

  const handleProjectChange = (newProjectId: string) => {
    const newProject = [...projectsData.myProjects, ...projectsData.productions.flatMap(p => p.projects)]
      .find(p => p.id === newProjectId)
    if (newProject) {
      setCurrentProject(newProject)
      router.push(`/project?id=${newProjectId}&category=${category}`)
    }
  }

  const handleDropdownOpen = (open: boolean) :void => {
    onDropdownOpen(open)
  }

  return (
    <Sidebar 
      className="border-r fixed top-0 left-16 h-full z-30" 
      collapsible="icon"
    >
      <SidebarHeader className="h-13 px-2 flex items-center">
        <DropdownMenu onOpenChange={handleDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className='flex items-center'>
                <Film className="mr-2 h-4 w-4" />
                <span className="truncate group-data-[collapsible=icon]:hidden">{currentProject.name}</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56"
            side="bottom"
            align="start"
          >
            <DropdownMenuLabel>My Projects</DropdownMenuLabel>
            {projectsData.myProjects.map((project) => (
              <DropdownMenuItem key={project.id} onSelect={() => handleProjectChange(project.id)}>
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {projectsData.productions.map((production, index) => (
              <React.Fragment key={production.name}>
                <DropdownMenuLabel>{production.name}</DropdownMenuLabel>
                {production.projects.map((project) => (
                  <DropdownMenuItem key={project.id} onSelect={() => handleProjectChange(project.id)}>
                    {project.name}
                  </DropdownMenuItem>
                ))}
                {index < projectsData.productions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant={category === item.href.split('/').pop() ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleCategoryClick(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
            </Button>
          ))}
        </div>
        <div className="my-4 h-[1px] bg-border" />
        <div className="space-y-1 py-2">
          {bottomItems.map((item) => (
            <Button
              key={item.name}
              variant={category === item.href.split('/').pop() ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleCategoryClick(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
            </Button>
          ))}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}