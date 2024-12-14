'use client'

import * as React from 'react'
import { Plus, ChevronDown, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ProductionTeam from './production-team'
import ProjectTeam from './project-team'
import { Category } from "@/types"
import {categoriesNames} from "@/consts"
import { ScrollArea } from "@/components/ui/scroll-area"

// This is a placeholder. You should replace it with your actual projects data
const projects = [
  { id: 'all', name: 'All in Production' },
  { id: '1', name: 'Project 1' },
  { id: '2', name: 'Project 2' },
  { id: '3', name: 'Project 3' },
]

// This is a placeholder. Replace with your actual departments data
const departments = [
  { id: '1', name: 'Production' },
  { id: '2', name: 'Camera' },
  { id: '3', name: 'Art' },
  { id: '4', name: 'Costume' },
  { id: '5', name: 'Makeup' },
]

// const permissions: Category[] = [
//   "Script",
//   "Budget",
//   "Schedule",
//   "Callsheet",
//   "Stripboard",
// ]

export default function TeamLayout() {
  const [selectedProject, setSelectedProject] = React.useState(projects[0])
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([])
  const [filterPermissions, setFilterPermissions] = React.useState<Category[]>([])

const allCategories: Category[] = categoriesNames.map(item => item.value);

  const handleDepartmentFilter = (departmentName: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentName) 
        ? prev.filter(dep => dep !== departmentName)
        : [...prev, departmentName]
    )
  }

  const handleAllDepartmentsFilter = () => {
    setSelectedDepartments(
      selectedDepartments.length === departments.length ? [] : departments.map(dep => dep.name)
    )
  }

  const handlePermissionFilter = (permission: Category) => {
    setFilterPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleAllPermissionsFilter = () => {

    setFilterPermissions(
      filterPermissions.length === categoriesNames.length ? [] : [...allCategories]
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none py-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="default">Invite to Production</Button>
            
          </div>
          <div className="flex items-center space-x-2">
          <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={selectedDepartments.length > 0 && selectedDepartments.length < departments.length ? "bg-primary text-primary-foreground" : ""}>
                  <Filter className="mr-2 h-4 w-4" />
                  Departments
                  {selectedDepartments.length > 0 && selectedDepartments.length < departments.length && (
                    <span className="ml-2 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs">
                      {selectedDepartments.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-departments"
                      checked={selectedDepartments.length === departments.length}
                      onCheckedChange={handleAllDepartmentsFilter}
                    />
                    <Label htmlFor="all-departments" className="font-semibold">All Departments</Label>
                  </div>
                  {departments.map(dep => (
                    <div key={dep.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={dep.id}
                        checked={selectedDepartments.includes(dep.name)}
                        onCheckedChange={() => handleDepartmentFilter(dep.name)}
                      />
                      <Label htmlFor={dep.id}>{dep.name}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {selectedProject.id !== 'all' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={filterPermissions.length > 0 && filterPermissions.length < categoriesNames.length ? "bg-primary text-primary-foreground" : ""}>
                    <Filter className="mr-2 h-4 w-4" />
                    Permissions
                    {filterPermissions.length > 0 && filterPermissions.length < categoriesNames.length && (
                      <span className="ml-2 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs">
                        {filterPermissions.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-permissions"
                        checked={filterPermissions.length === categoriesNames.length}
                        onCheckedChange={handleAllPermissionsFilter}
                      />
                      <Label htmlFor="all-permissions" className="font-semibold">All Permissions</Label>
                    </div>
                    {categoriesNames.map((permission) => (
                      <div key={permission.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.value}`}
                          checked={filterPermissions.includes(permission.value)}
                          onCheckedChange={() => handlePermissionFilter(permission.value)}
                        />
                        <Label htmlFor={`permission-${permission}`}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {selectedProject.name}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {projects.map((project) => (
                  <DropdownMenuItem 
                    key={project.id}
                    onSelect={() => setSelectedProject(project)}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        {selectedProject.id === 'all' ? (
          <ProductionTeam selectedDepartments={selectedDepartments} />
        ) : (
          <ProjectTeam project={selectedProject} filterPermissions={filterPermissions} />
        )}
      </div>
    </div>
  )
}