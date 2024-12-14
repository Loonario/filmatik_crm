'use client'

import * as React from 'react'
import { Separator } from "@/components/ui/separator"
import {Spinner} from "@/components/ui/spinner"
import { useProfileProjectsContext } from '@/contexts/ProfileProjectsContext'
import { 
  getCurrentUserProfile, 
  getCustomerData, 
  getCustomerProjectsAll, 
  UserProfile, 
  Customer, 
  Project,
  Department,
  Position,
} from '@/lib/api'
import {  UserRoleInProduction,
  Category} from "@/types"
import { CustomerProjectsAll } from "@/lib/api-productions"
import { ProjectCard } from './project-card'
import { NewProjectButton } from './new-project-button'
import { Production } from '@/lib/api-productions'
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ProductionMenuItem extends Production {
  department: Department;
  position: Position;
  role_in_production: UserRoleInProduction;
}

// interface ProjectWithAccess {
// project: Project;
// department: Department;
// position: Position,
// access_to_categories: Category[]
// }


const LoadingSpinner = () => (
  <Spinner />
)

export default function DashboardHomeComponent() {
  const { profile, 
    setProfile, 
    customer, 
    setCustomer, 
    projects, 
    setProjects, 
    fetchUser, 
    isLoadingContext  } = useProfileProjectsContext()
  const [state, setState] = React.useState<{
    // userProfile: UserProfile | null;
    // currentCustomer: Customer | null;
    // projects: CustomerProjectsAll | null;
    selectedProduction: ProductionMenuItem | null;
    isLoading: boolean;
    error: string | null;
  }>({
    // userProfile: profile,
    // currentCustomer: customer,
    // projects: projects,
    selectedProduction: null,
    isLoading: false,
    error: null,
  })

  // const fetchData = React.useCallback(async () => {
  //   try {
  //     setState(prev => ({ ...prev, isLoading: true, error: null }))
      
  //     // const profile = await getCurrentUserProfile()
  //     // if (!profile) throw new Error('Failed to fetch user profile')

  //     const updates: Partial<typeof state> = { userProfile: profile }
      
  //     if (profile.role === 'customer') {
  //       const customerData = await getCustomerData(profile.id)
  //       if (customerData) {
  //         updates.customer = customerData
  //         const customerProjects = await getCustomerProjectsAll(customerData.id)
  //         updates.projects = customerProjects
  //       }
  //     }

  //     setState(prev => ({
  //       ...prev,
  //       ...updates,
  //       isLoading: false
  //     }))
  //   } catch (err) {
  //     setState(prev => ({
  //       ...prev,
  //       error: err instanceof Error ? err.message : 'An unexpected error occurred',
  //       isLoading: false
  //     }))
  //   }
  // }, [])

  // React.useEffect(() => {
  //   fetchData()
  // }, [fetchData])


// First, let's log the initial state
// React.useEffect(() => {
//    console.log('Initial state.projects:', projects);
// }, [projects]);

  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      isLoading: isLoadingContext,
    }))
  },[isLoadingContext])

// Get available productions from projects data
const productions = React.useMemo(() => {
 // console.log('Projects data in productions memo:', projects?.productions);
  
  if (!projects?.productions) {
   // console.log('No productions found in state');
    return [];
  }
  
  const mappedProductions = projects.productions
    .filter(p => {
    //  console.log('Production before filter:', p);
      return p.production !== null;
    })
    .map(p => {
    //  console.log('Production after filter, before mapping:', p);
      return {
        ...p.production!,
        department: p.department,
        position: p.position,
        role_in_production: p.role_in_production
      };
    });
    
 // console.log('Final mapped productions:', mappedProductions);
  return mappedProductions;
}, [projects]);

  // Check if user can create project in current context
  const canCreateProject = React.useMemo(() => {
    if (!state.selectedProduction || !projects?.productions) return true
    
    const productionAccess = projects.productions.find(
      p => p.production?.id === state.selectedProduction?.id
    )
    
    return productionAccess?.role_in_production === 'admin'
  }, [state.selectedProduction, projects])

  // Get current projects based on selection
const currentProjects = React.useMemo(() => {
  // Early return if projects is null
  if (!projects) return []
  
  // Handle selected production case
  if (state.selectedProduction && projects.productions) {
    const productionProjects = projects.productions.find(
      p => p.production?.id === state.selectedProduction?.id
    )
    
    if (!productionProjects?.projects) return []
    
    return productionProjects.projects
  }

  // Handle my_projects case
  if (!projects.my_projects) return []
  
  return projects.my_projects.projects.map(project => ({
    project: project,
    department: null,
    position: null,
    access_to_categories: projects?.my_projects?.access_to_categories || []
  }))

}, [projects, state.selectedProduction])


  if (state.isLoading) return <LoadingSpinner />
  if (state.error) return <div className="text-red-500">{state.error}</div>

  return (
    <div className="space-y-8">

      {/* <div className="text-sm text-gray-500">
    <pre>
      {JSON.stringify({
        hasProjects: !! projects,
        hasProductions: !! projects?.productions,
        productionsLength: projects?.productions?.length,
        mappedProductionsLength: productions.length
      }, null, 2)}
    </pre>
  </div> */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-ellipsis overflow-hidden text-nowrap">
          {state.selectedProduction ? state.selectedProduction.name : 'My Projects'}
        </h2>
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="max-w-xs">
      <span className="text-ellipsis overflow-hidden text-nowrap">
        {state.selectedProduction ? state.selectedProduction.name : 'My Projects'}
      </span>
      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-auto max-w-[250px]">
    <DropdownMenuItem 
      onSelect={() => setState(prev => ({ ...prev, selectedProduction: null }))}
    >
      My Projects
    </DropdownMenuItem>
        <Separator />
    {productions.map(production => (
      <DropdownMenuItem 
        key={production.id} 
        onSelect={() => setState(prev => ({ ...prev, selectedProduction: production }))}
      >
        <p className="text-ellipsis overflow-hidden text-nowrap">{production.name}</p>
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
      </div>
      <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
  {currentProjects.map((projectData) => (
    <ProjectCard 
      key={projectData.project.id} 
      project={projectData.project}
      roleInProduction={state.selectedProduction ? state.selectedProduction.role_in_production : null}
      category={
        Array.isArray(projectData.access_to_categories) && projectData.access_to_categories.length > 0
          ? projectData.access_to_categories[0] 
          : 'crew'
      }
    />
  ))}
  {canCreateProject && <NewProjectButton />}
</div>
      </section>
    </div>
  )
}