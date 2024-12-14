'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrewList } from './crew/crew-list'
import { Episode, ProData, Pro, UserProfile,  DepartmentPositions, Customer} from "@/lib/api"
import { StatusItemInProject } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Filter, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AddCrewMemberForm } from './crew/add-crew-member-form'
import { BudgetComponent } from './budget/budget-component'

interface DashboardProjectComponentProps {
  category: string;
  selectedEpisode: Episode | null;
  allEpisodesEpisode: Episode | null;
  availableEpisodes: Episode[];
  crew: ProData[];
  onEpisodeChange: (episode: Episode) => void;
  onAddCrewMember: (newCrewMember: ProData) => void;
  onUpdateCrewMember: (updatedCrewMember: ProData) => void;
  onUpdateDepartment: (id: string, newDepartment: string) => void;
  onUpdatePosition: (id: string, newPosition: string) => void;
  departmentPositions: DepartmentPositions[];
  customer: Customer | null;
}

export function DashboardProjectComponent({ 
  category, 
  selectedEpisode, 
  availableEpisodes, 
  crew, 
  allEpisodesEpisode,
  onEpisodeChange,
  onAddCrewMember,
  onUpdateCrewMember,
  onUpdateDepartment,
  onUpdatePosition,
  departmentPositions,
  customer
}: DashboardProjectComponentProps) {
  const [activeTab, setActiveTab] = React.useState<StatusItemInProject | "budget">('pre_selected')
  const [crewMembers, setCrewMembers] = React.useState<ProData[]>(crew)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([])


  React.useEffect(() => {
    setCrewMembers(crew)
  }, [crew])

  React.useEffect(() => {
    setSelectedDepartments(departmentPositions.map(d => d.name))
  }, [departmentPositions])

  const handleStatusChange = (id: string, newStatus: StatusItemInProject) => {
    const updatedMember = crewMembers.find(member => member.pro.id === id)
    if (updatedMember) {
      const newMember = { ...updatedMember, status: newStatus }
      onUpdateCrewMember(newMember)
    }
  }

  const handleEpisodesChange = (id: string, newEpisodes: Episode[]) => {
    setCrewMembers(prev => prev.map(member => 
      member.pro.id === id ? { ...member, episodes: newEpisodes } : member
    ))
  }

  const handleAddCrewMember = (newCrewMember: ProData) => {
    onAddCrewMember(newCrewMember)
    setIsDialogOpen(false)
  }

  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    )
  }

  const handleAllDepartmentsFilter = () => {
    setSelectedDepartments(prev => 
      prev.length === departmentPositions.length ? [] : departmentPositions.map(d => d.name)
    )
  }

  const renderCategoryContent = () => {
    if (activeTab === 'budget') {
      return <BudgetComponent 
        category={category}
        selectedEpisode={selectedEpisode}
        allEpisodesEpisode={allEpisodesEpisode}
        availableEpisodes={availableEpisodes}
        crew={crewMembers}
        selectedDepartments={selectedDepartments}
      />
    }
    if (category === 'crew') {
      return <CrewList 
        selectedEpisode={selectedEpisode}
        allEpisodesEpisode={allEpisodesEpisode} 
        activeTab={activeTab} 
        availableEpisodes={availableEpisodes}
        crewMembers={crew.filter(member => 
          selectedDepartments.length === 0 || selectedDepartments.includes(member.department.name)
        )}
        onStatusChange={handleStatusChange}
        onEpisodesChange={handleEpisodesChange}
        onEpisodeChange={onEpisodeChange}
        onUpdateDepartment={onUpdateDepartment}
        onUpdatePosition={onUpdatePosition}
        departmentPositions={departmentPositions}
        onUpdateCrewMember={onUpdateCrewMember}
        customer= {customer}
      />
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">No data available</h3>
            <p>This category is not implemented yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
      <Tabs defaultValue="pre_selected" className="w-full" 
      onValueChange={(value) => setActiveTab(value as StatusItemInProject | "budget")}>
        <div className='space-x-4 flex items-center'>
          <TabsList>
            <TabsTrigger className='w-[100px]' value="pre_selected">Pre-selected</TabsTrigger>
            <TabsTrigger className='w-[100px]' value="requested">Requested</TabsTrigger>
            <TabsTrigger className='w-[100px]' value="booked">Booked</TabsTrigger>
            <TabsTrigger className='w-[100px]' value="budget">Budget</TabsTrigger>
          </TabsList>
          {category === 'crew' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={selectedDepartments.length > 0  && selectedDepartments.length < departmentPositions.length ? "bg-primary text-primary-foreground" : ""}>
                    <Filter className="mr-2 h-4 w-4" />
                    Departments
                    {selectedDepartments.length > 0 && selectedDepartments.length < departmentPositions.length && (
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
                        checked={selectedDepartments.length === departmentPositions.length}
                        onCheckedChange={handleAllDepartmentsFilter}
                      />
                      <Label htmlFor="all-departments" className="font-semibold">All Departments</Label>
                    </div>
                    {departmentPositions.map(dep => (
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
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>+</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Crew Member</DialogTitle>
                </DialogHeader>
                <AddCrewMemberForm 
                  onSubmit={handleAddCrewMember} 
                  allEpisodesEpisode={allEpisodesEpisode}
                  departmentPositions={departmentPositions}
                />
              </DialogContent>
            </Dialog>
        </div>
        <TabsContent value="pre_selected">{renderCategoryContent()}</TabsContent>
        <TabsContent value="requested">{renderCategoryContent()}</TabsContent>
        <TabsContent value="booked">{renderCategoryContent()}</TabsContent>
        <TabsContent value="budget">{renderCategoryContent()}</TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

//Show total not for opened accordions but for all filtered Episodes in budget.
// Make accordion toggle content a little bigger and add weight, as headings, add some paddings for the toggle and items.