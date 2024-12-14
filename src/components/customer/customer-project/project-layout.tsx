'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProfileProjects, useProfileProjectsContext } from '@/contexts/ProfileProjectsContext';
import { ChevronsUpDown, Edit, Plus, Filter } from 'lucide-react'
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
import { ProjectSidebar } from '@/components/customer/customer-project/sidebar'
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
import {Department,
  Position,
  getCurrentUserProfile,
   getCustomerData,
    getProjects,
     getEpisodes,
      UserProfile,
       Customer,
        Project,
         Episode,
          ProjectEpisodePro,
           Pro, 
          getPros,
        getProjectEpisodePros, getCrew,
         ProData, DepartmentPositions,
        getAllDepartmentPositions,
       } from '@/lib/api'
import {Production, CustomerProjectsAll} from "@/lib/api-productions"
import {UserRoleInProduction, Category, SidebarProjectMenuItems, SidebarProjectMenu} from "@/types"
import {sidebarProjectMenuItems} from "@/consts"
import { Suspense } from 'react'
import { v4 as uuidv4 } from 'uuid';

export interface ProjectWithAccess {
  project: Project;
  department: Department | null;
  position: Position | null;
  access_to_categories: Category[],
}

export interface ProjectLayoutContentProps {
    roleInProduction: UserRoleInProduction | null,
    project_id: string;
    production_id: string;
    current_category: Category;
}

function ProjectLayoutContent({
  roleInProduction,
  project_id,
  current_category,
  production_id}: ProjectLayoutContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // const projectId = searchParams?.get('id')
  const { profile, 
    setProfile, 
    customer,
     setCustomer, 
     projects, 
     setProjects, 
     fetchUser, 
    //  production,
    //  setProduction,
     isLoadingContext,
      } = useProfileProjectsContext()
  // const [userProfile, setUserProfile] = React.useState<UserProfile | null>(currentUserProfile)
  // const [customer, setCustomer] = React.useState<Customer | null>(currentCustomer)
  const [allProjectsWithAccess, setAllProjectsWithAccess] = React.useState<ProjectWithAccess[]>([])
  const [episodes, setEpisodes] = React.useState<Episode[]>([])
  const [selectedProject, setSelectedProject] = React.useState<ProjectWithAccess | null>(null)
  const [selectedEpisode, setSelectedEpisode] = React.useState<Episode | null>(null)
  const [allEpisodesEpisode, setAllEpisodesEpisode] = React.useState<Episode | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false)
  const [isMouseOverSidebar, setIsMouseOverSidebar] = React.useState<boolean>(false)
  const [isSidebarDropdownOpen, setIsSidebarDropdownOpen] = React.useState<boolean>(false)
  const sidebarCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newEpisodeName, setNewEpisodeName] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [crew, setCrew] = React.useState<ProData[]>([])
  const [departmentPositions, setDepartmentPositions] = React.useState<DepartmentPositions[]>([])
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([])
  const [sidebarMenu, setSidebarMenu] = React.useState<SidebarProjectMenu[]>([])
  const [category, setCategory] = React.useState<SidebarProjectMenu> (current_category) || 'crew'
  const [production, setProduction] = React.useState<Production | null> (null)
// const [currentCategory, setCurrentCategory] = React.useState<Category>(current_category)

  const { toast } = useToast()

  const fetchProjectData = async (projectWithAccess: ProjectWithAccess) => {
    try {
      setIsLoading(true)
      setError(null)

      const [projectEpisodes] = await Promise.all([
        getEpisodes(projectWithAccess.project.id),
      ])
      
      setEpisodes(projectEpisodes)
      const allEpisode = projectEpisodes.find(e => e.isAll)
      setAllEpisodesEpisode(allEpisode || null)
      setSelectedEpisode(allEpisode || projectEpisodes[0] || null)
      
      // Only fetch crew data if 'crew' is in the project's access_to_categories
      if (projectWithAccess.access_to_categories.includes('crew')) {
        const crewFetched = await getCrew(projectWithAccess.project.id)
        setCrew(crewFetched)
      } else {
        setCrew([])
      }

      // Update sidebar menu
      const availableCategories = projectWithAccess.access_to_categories
      const combinedMenu = [...availableCategories, ...sidebarProjectMenuItems]
      setSidebarMenu(combinedMenu)

    } catch (err) {
      setError('Failed to fetch project data. Please try again later.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInitialData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [depPos] = await Promise.all([
      getAllDepartmentPositions()
      ])
      setDepartmentPositions(depPos)
      if (production_id && Array.isArray(projects?.productions)) {
        const currentProduction = projects.productions
          .find(proj => proj.production?.id === production_id)
        if (currentProduction) {
          setProduction(currentProduction.production)
          const productionProjects = currentProduction.projects
          if (productionProjects) {
            setAllProjectsWithAccess(productionProjects)
            const currentProject = productionProjects.find(p => p.project.id === project_id)
            if (currentProject) {
              setSelectedProject(currentProject)
              
              await fetchProjectData(currentProject)
            }
          }
        }
      } else {
        if (projects && projects.my_projects) {
          const accessToCategories = projects.my_projects.access_to_categories
          const myProjects = projects?.my_projects?.projects.map(p => ({
            project: p, 
            department: null, 
            position: null, 
            access_to_categories: accessToCategories
          }))
          if (accessToCategories && myProjects) {
            setAllProjectsWithAccess(myProjects)
            const currentProject = myProjects.find(p => p.project.id === project_id)
            if (currentProject) {
              setSelectedProject(currentProject)
              setProduction(null)
              await fetchProjectData(currentProject)
            }
          }
        }
      }
    } catch (err) {
      setError('Failed to fetch initial data. Please try again later.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }


    React.useEffect(() => {
      fetchInitialData()
    }, [projects, project_id, production_id])

  // Update sidebar menu when selected project changes
  React.useEffect(() => {
    if (selectedProject) {
      const availableCategories = selectedProject.access_to_categories
      const combinedMenu = [...availableCategories, ...sidebarProjectMenuItems]
      setSidebarMenu(combinedMenu)
    }
  }, [selectedProject])

  React.useEffect(() => {
    const allEp = episodes.find(ep => ep.isAll)
      if(allEp){
        setSelectedEpisode(allEp)
      }
  }, [episodes])

  const handleSetCategory = React.useCallback((newCategory: SidebarProjectMenu) => {
    setCategory(newCategory)
  }, [])

  const handleSetProject = React.useCallback((project: ProjectWithAccess) => {
    setSelectedProject(project)
    fetchProjectData(project)
    setIsSidebarOpen(false)
    setIsSidebarDropdownOpen(false)
  }, [])

  const handleAddCrewMember = (newCrewMember: ProData) => {
    setCrew(prevCrew => [...prevCrew, newCrewMember])
  }
  const handleUpdateCrewMember = (updatedCrewMember: ProData) => {
    setCrew(prevCrew => prevCrew.map(member => 
      member.pro.id === updatedCrewMember.pro.id ? updatedCrewMember : member
    ))
  }
  const handleUpdateDepartment = (id: string, newDepartment: string) => {
    setCrew(prevCrew => prevCrew.map(member => 
      member.pro.id === id ? { ...member, department: { ...member.department, name: newDepartment } } : member
    ))
  }

  const handleUpdatePosition = (id: string, newPosition: string) => {
    setCrew(prevCrew => prevCrew.map(member => 
      member.pro.id === id ? { ...member, position: { ...member.position, name: newPosition } } : member
    ))
  }

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
      }, 200) // Delay closing the sidebar
    }
  }

  const handleDropdownOpen = (isOpen: boolean): void => {
    setIsSidebarDropdownOpen(isOpen)
    if (isOpen) {
      setIsSidebarOpen(true)
    } else if (!isMouseOverSidebar) {
      sidebarCloseTimeoutRef.current = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 200) // Delay closing the sidebar
    }
  }

  const handleAddEpisode = () => {
    setNewEpisodeName('')
    setIsDialogOpen(true)
  }

  const handleEditEpisode = () => {
    if (selectedEpisode && !selectedEpisode?.isAll) {
      setNewEpisodeName(selectedEpisode.name)
      setIsDialogOpen(true)
    }
  }

  const handleApplyEpisode = () => {
    if (selectedProject) {
      if (selectedEpisode && selectedEpisode?.isAll) {
        // Adding a new episode
        setEpisodes([...episodes, { id: uuidv4(), project_id: selectedProject.project.id, name: newEpisodeName, isAll: false, updated_at: new Date().toISOString(), created_at: new Date().toISOString() }])
        toast({
          title: "New episode added",
          description: `Episode "${newEpisodeName}" has been added to the project.`,
          duration: 3000,
        })
      } else if(selectedEpisode && !selectedEpisode?.isAll) {
        // Editing an existing episode

        setEpisodes(episodes.map(ep => ep.id === selectedEpisode.id ? { ...ep, name: newEpisodeName } : ep))
        //setSelectedEpisode(newEpisodeName)
        toast({
          title: "Episode name updated",
          description: `Episode name has been updated to "${newEpisodeName}".`,
          duration: 3000,
        })
      }
    }
    setIsDialogOpen(false)
  }
  const handleEpisodeChange = (episode: Episode) => {
    setSelectedEpisode(episode)
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  if (!selectedProject) {
    return <div className="p-4 text-center">Project not found</div>
  }

  // const handleDepartmentFilter = (department: string) => {
  //   setSelectedDepartments(prev => 
  //     prev.includes(department) 
  //       ? prev.filter(d => d !== department)
  //       : [...prev, department]
  //   )
  // }

  const renderContent = () => {
    switch (category) {
      case 'budget':
        return <OverallBudget 
        selectedEpisode= {selectedEpisode}
      allEpisodesEpisode= {allEpisodesEpisode}
      availableEpisodes= {episodes}
      crew= {crew}
        /> // Placeholder for budget component
      case 'calendar':
        return <CalendarComponent 
        availableEpisodes={episodes}
        allEpisodesEpisode= {allEpisodesEpisode}
        crew={crew}/>
      default:
        return <DashboardProjectComponent 
          category={category} 
          selectedEpisode={selectedEpisode}
          availableEpisodes={episodes}
          allEpisodesEpisode={allEpisodesEpisode}
          crew={crew}
          onEpisodeChange={handleEpisodeChange}
          onAddCrewMember={handleAddCrewMember}
          onUpdateCrewMember={handleUpdateCrewMember}
          onUpdateDepartment={handleUpdateDepartment}
          onUpdatePosition={handleUpdatePosition}
          departmentPositions={departmentPositions}
          customer = {customer}
        />
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  if (!selectedProject) {
    return <div className="p-4 text-center">Project not found</div>
  }


  return (
    <SidebarProvider open={isSidebarOpen} defaultOpen={false}>
      <div className="flex h-full w-full">
        <div 
          className={`${isSidebarOpen ? "shadow-xl" : ""} fixed top-0 left-16 h-full z-30`}
          onMouseEnter={handleSidebarEnter}
          onMouseLeave={handleSidebarLeave}
        >
          <ProjectSidebar 
            onDropdownOpen={handleDropdownOpen}
            projects={allProjectsWithAccess}
            currentProject={selectedProject}
            setCurrentProject={handleSetProject}
            sidebarMenuItems={sidebarMenu}
            currentCategory={category}
            setCurrentCategory={handleSetCategory}
            production={production}
          />
        </div>  
        <div className="flex-1 w-full overflow-y-auto ml-16 p-4 space-y-4">
          <div>
            <header className="flex items-center justify-between h-13">
              <h1 className="text-2xl font-bold">{selectedProject.project.name}</h1>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between">
                    {selectedEpisode?.name || 'Select Episode'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {episodes.map((episode) => (
                    <DropdownMenuItem
                      key={episode.id}
                      onSelect={() => handleEpisodeChange(episode)}
                    >
                      {episode.name}
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
                      <DialogTitle>{selectedEpisode?.isAll ? 'Add New Episode' : 'Edit Episode'}</DialogTitle>
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
                  disabled={selectedEpisode?.isAll}
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

export default function ProjectLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract and validate query params
  const project_id = searchParams.get('project_id');
  const production_id = searchParams.get('production_id');
  const current_category = searchParams.get('current_category') as Category;
  const role_in_production = searchParams.get('role_in_production') as UserRoleInProduction;

  // Validate required params
  if (!project_id || !current_category) {
    router.push('/');
    return null;
  }

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
    <ProjectLayoutContent
      project_id={project_id}
      production_id={production_id || ''}
      current_category={current_category}
      roleInProduction={role_in_production || null}
    />
    </Suspense>
  );
}
// export function ProjectLayout({
//   currentUserProfile, 
//   currentCustomer, 
//   allProjectsWithAccess, 
//   currentProduction,
//   roleInProduction,
//   currentProjectWithAccess}: ProjectLayoutContentProps) {

//   return (
//     <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
//       <ProjectLayoutContent 
//       currentUserProfile = {userProfile}
//       currentCustomer, 
//       allProjectsWithAccess, 
//       currentProduction,
//       roleInProduction,
//       currentProjectWithAccess
//       />
//     </Suspense>
//   )
// }