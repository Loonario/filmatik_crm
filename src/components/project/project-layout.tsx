'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronsUpDown, Edit, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardProjectComponent } from './dashboard-project-component'
import { OverallBudget } from './overall-budget'
import { CalendarComponent } from './calendar'
import { ProjectSidebar } from '@/components/project/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data for projects
const projectsData: Record<string, { name: string; episodes: string[] }> = {
  "1": { name: 'Sci-Fi Epic', episodes: ['Episode 1', 'Episode 2', 'Episode 3'] },
  "2": { name: 'Romantic Comedy', episodes: ['Episode 1', 'Episode 2'] },
  "3": { name: 'Action Thriller', episodes: ['Episode 1', 'Episode 2', 'Episode 3', 'Episode 4'] },
  "4": { name: 'Period Drama', episodes: ['Episode 1'] },
  "5": { name: 'Superhero Blockbuster', episodes: ['Episode 1', 'Episode 2'] },
  "6": { name: 'Indie Documentary', episodes: ['Part 1', 'Part 2'] },
}

export function ProjectLayout() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('id')
  const category = searchParams.get('category') || 'crew'
  const [project, setProject] = React.useState(projectId && projectsData[projectId] ? projectsData[projectId] : null)
  const [selectedEpisode, setSelectedEpisode] = React.useState<string>('All Episodes')
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false)
  const [isMouseOverSidebar, setIsMouseOverSidebar] = React.useState<boolean>(false)
  const [isSidebarDropdownOpen, setIsSidebarDropdownOpen] = React.useState<boolean>(false)
  const sidebarCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newEpisodeName, setNewEpisodeName] = React.useState('')
  const { toast } = useToast()

  React.useEffect(() => {
    setSelectedEpisode('All Episodes')
  }, [])

  const handleSidebarEnter = () => {
    setIsMouseOverSidebar(true)
    setIsSidebarOpen(true)
    if (sidebarCloseTimeoutRef.current) {
      clearTimeout(sidebarCloseTimeoutRef.current)
    }
  }

  const handleSidebarLeave = () => {
    setIsMouseOverSidebar(false)
    if (!isSidebarDropdownOpen) {
      sidebarCloseTimeoutRef.current = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300) // Delay closing the sidebar
    }
  }

  const handleDropdownOpen = (isOpen: boolean): void => {
    setIsSidebarDropdownOpen(isOpen)
    if (isOpen) {
      setIsSidebarOpen(true)
    } else if (!isMouseOverSidebar) {
      sidebarCloseTimeoutRef.current = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300) // Delay closing the sidebar
    }
  }

  const handleAddEpisode = () => {
    setNewEpisodeName('')
    setIsDialogOpen(true)
  }

  const handleEditEpisode = () => {
    if (selectedEpisode !== 'All Episodes') {
      setNewEpisodeName(selectedEpisode)
      setIsDialogOpen(true)
    }
  }

  const handleApplyEpisode = () => {
    if (project) {
      if (selectedEpisode === 'All Episodes') {
        // Adding a new episode
        setProject({
          ...project,
          episodes: [...project.episodes, newEpisodeName]
        })
        toast({
          title: "New episode added",
          description: `Episode "${newEpisodeName}" has been added to the project.`,
          duration: 3000,
        })
      } else {
        // Editing an existing episode
        setProject({
          ...project,
          episodes: project.episodes.map(ep => ep === selectedEpisode ? newEpisodeName : ep)
        })
        setSelectedEpisode(newEpisodeName)
        toast({
          title: "Episode name updated",
          description: `Episode name has been updated to "${newEpisodeName}".`,
          duration: 3000,
        })
      }
    }
    setIsDialogOpen(false)
  }

  if (!project) {
    return <div className="p-4 text-center">Project not found</div>
  }

  const renderContent = () => {
    switch (category) {
      case 'budget':
        return <OverallBudget selectedEpisode={selectedEpisode} />
      case 'calendar':
        return <CalendarComponent />
      default:
        return <DashboardProjectComponent 
          category={category} 
          selectedEpisode={selectedEpisode}
          availableEpisodes={project.episodes}
        />
    }
  }

  return (
    <SidebarProvider open={isSidebarOpen} defaultOpen={false}>
      <div className="flex h-full w-full">
        <div 
          className={`${isSidebarOpen ? "shadow-xl" : ""} fixed top-0 left-16 h-full z-30`}
          onMouseEnter={handleSidebarEnter}
          onMouseLeave={handleSidebarLeave}
        >
          <ProjectSidebar onDropdownOpen={handleDropdownOpen} />
        </div>  
        <div className="flex-1 w-full overflow-y-auto ml-16 p-4 space-y-4">
          <div>
            <header className="flex items-center justify-between h-13">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between">
                      {selectedEpisode}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuItem onSelect={() => setSelectedEpisode('All Episodes')}>
                      All Episodes
                    </DropdownMenuItem>
                    {project.episodes.map((episode) => (
                      <DropdownMenuItem
                        key={episode}
                        onSelect={() => setSelectedEpisode(episode)}
                      >
                        {episode}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onSelect={handleAddEpisode}>
                      <Plus className="mr-2 h-4 w-4" /> Add Episode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedEpisode === 'All Episodes' ? 'Add New Episode' : 'Edit Episode'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="episodeName" className="text-right">
                          Episode Name
                        </Label>
                        <Input
                          id="episodeName"
                          value={newEpisodeName}
                          onChange={(e) => setNewEpisodeName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={handleApplyEpisode}>Apply</Button>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleEditEpisode}
                  disabled={selectedEpisode === 'All Episodes'}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </header>
          </div>
          <main>
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}