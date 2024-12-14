'use client'

import * as React from 'react'
import { Edit, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Category } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {categoriesNames} from "@/consts"

interface ProjectTeamProps {
  project: {
    id: string;
    name: string;
  };
  filterPermissions: Category[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  position: string;
  department: string;
  permissions: Category[];
}

// This is a placeholder. Replace with your actual team members data
const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', avatar: '/avatars/john-doe.png', position: 'Director', department: 'Production', permissions: ['costumes', 'special_vehicles', 'cast'] },
  { id: '2', name: 'Jane Smith', avatar: '/avatars/jane-smith.png', position: 'Producer', department: 'Production', permissions: ['equipment', 'vehicles', 'crew'] },
  { id: '3', name: 'Bob Johnson', avatar: '/avatars/bob-johnson.png', position: 'Camera Operator', department: 'Camera', permissions: ['crew', 'props'] },
  { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', permissions: ['transportation', 'equipment', 'props'] },
]

const departments = ['Production', 'Camera', 'Art', 'Costume', 'Makeup']

const positions = {
  'Production': ['Director', 'Producer', 'Production Manager'],
  'Camera': ['Director of Photography', 'Camera Operator', 'Focus Puller'],
  'Art': ['Art Director', 'Set Designer', 'Prop Master'],
  'Costume': ['Costume Designer', 'Wardrobe Supervisor', 'Costume Assistant'],
  'Makeup': ['Makeup Artist', 'Hair Stylist', 'Special Effects Makeup'],
}

const allCategories: Category[] = categoriesNames.map(item => item.value);

export default function ProjectTeam({ project, filterPermissions }: ProjectTeamProps) {
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([])
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSelectAll = () => {
    setSelectedMembers(
      selectedMembers.length === teamMembers.length ? [] : teamMembers.map(member => member.id)
    )
  }

  const handleRemoveSelected = () => {
    // Implement the logic to remove selected members from the project
    console.log("Removing selected members:", selectedMembers)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    // Implement the logic to save the edited member data
    console.log("Saving edited member:", editingMember)
    setIsEditDialogOpen(false)
    setEditingMember(null)
  }

  const filteredTeamMembers = filterPermissions.length > 0
    ? teamMembers.filter(member => member.permissions.some(permission => filterPermissions.includes(permission as Category)))
    : teamMembers

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="text-xl font-semibold mb-4">Team for {project.name}</h2>
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted border rounded-t-lg font-semibold">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedMembers.length === filteredTeamMembers.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">Select All</Label>
          </div>
          <div className="flex items-center">Name</div>
          <div className="flex items-center">Position in Production</div>
          <div className="flex items-center">Permissions</div>
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveSelected}
              disabled={selectedMembers.length === 0}
            >
              Remove Selected from Project
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="border rounded-b-lg overflow-hidden">
          {filteredTeamMembers.map(member => (
            <div key={member.id} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberSelection(member.id)}
                />
                <Label htmlFor={`member-${member.id}`} className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Label>
              </div>
              <div>{member.name}</div>
              <div>{member.position}</div>
              <div className="flex flex-wrap gap-1">
                {member.permissions.length === allCategories.length ? (
                  <Badge>All</Badge>
                ) : (
                  categoriesNames.filter((cat) => (
                    member.permissions.includes(cat.value)))
                    .map((item) => (
                      <Badge
                        key={item.value}
                        style={{ backgroundColor: item.color }}
                        className="text-white"
                      >
                        {item.name}
                      </Badge>
                    ))
                  )}
              </div>
              <div className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEditMember(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className=" flex flex-col gap-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={editingMember.avatar} alt={editingMember.name} />
                  <AvatarFallback>{editingMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{editingMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{editingMember.department}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="department" className="text-left">
                  Department
                </Label>
                <Select
                  value={editingMember.department}
                  onValueChange={(value) => setEditingMember({...editingMember, department: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="position" className="text-left">
                  Position
                </Label>
                <Select
                  value={editingMember.position}
                  onValueChange={(value) => setEditingMember({...editingMember, position: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions[editingMember.department as keyof typeof positions].map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-left">Permissions</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-between">
                      Select Permissions
                      <Check className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Permissions</h4>
                        <p className="text-sm text-muted-foreground">
                          Select the permissions for this team member.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="all"
                            checked={editingMember.permissions.length === allCategories.length}
                            onCheckedChange={(checked) => {
                              setEditingMember({
                                ...editingMember,
                                permissions: checked ? [...allCategories] : []
                              })
                            }}
                          />
                          <label
                            htmlFor="all"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            All Permissions
                          </label>
                        </div>
                        {categoriesNames.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.value}
                              checked={editingMember.permissions.includes(category.value)}
                              onCheckedChange={(checked) => {
                                setEditingMember({
                                  ...editingMember,
                                  permissions: checked
                                    ? [...editingMember.permissions, category.value]
                                    : editingMember.permissions.filter((p) => p !== category.value)
                                })
                              }}
                            />
                            <label
                              htmlFor={category.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-3 flex flex-wrap gap-1">
                {editingMember.permissions.length === allCategories.length ? (
                  <Badge>All</Badge>
                ) : (
                  categoriesNames.filter((cat) => (
                    editingMember.permissions.includes(cat.value)))
                    .map((item) => (
                      <Badge
                        key={item.value}
                        style={{ backgroundColor: item.color }}
                        className="text-white"
                      >
                        {item.name}
                      </Badge>
                    ))
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

