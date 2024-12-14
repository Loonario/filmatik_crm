'use client'

  import * as React from 'react'
  import { Edit } from 'lucide-react'
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"
  import { Label } from "@/components/ui/label"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  // This is a placeholder. Replace with your actual production name
  const productionName = "My Production"

  // This is a placeholder. You should replace it with your actual projects data
  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: '1', name: 'Project 1' },
    { id: '2', name: 'Project 2' },
    { id: '3', name: 'Project 3' },
  ]

  // This is a placeholder. Replace with your actual positions data
  const positions = {
    'Production': ['Director', 'Producer', 'Production Manager'],
    'Camera': ['Director of Photography', 'Camera Operator', 'Focus Puller'],
    'Art': ['Art Director', 'Set Designer', 'Prop Master'],
    'Costume': ['Costume Designer', 'Wardrobe Supervisor', 'Costume Assistant'],
    'Makeup': ['Makeup Artist', 'Hair Stylist', 'Special Effects Makeup'],
  }

  // This is a placeholder. Replace with your actual team members data
  const teamMembers = [
    { id: '1', name: 'John Doe', avatar: '/avatars/john-doe.png', position: 'Director', department: 'Production', role: 'Admin' },
    { id: '2', name: 'Jane Smith', avatar: '/avatars/jane-smith.png', position: 'Producer', department: 'Production', role: 'Admin' },
    { id: '3', name: 'Bob Johnson', avatar: '/avatars/bob-johnson.png', position: 'Camera Operator', department: 'Camera', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
    { id: '4', name: 'Alice Brown', avatar: '/avatars/alice-brown.png', position: 'Art Director', department: 'Art', role: 'Teammate' },
  ]

  interface ProductionTeamProps {
    selectedDepartments: string[]
  }

  export default function ProductionTeam({ selectedDepartments }: ProductionTeamProps) {
    const [selectedMembers, setSelectedMembers] = React.useState<string[]>([])
    const [editingMember, setEditingMember] = React.useState<typeof teamMembers[0] | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [isAddToProjectDialogOpen, setIsAddToProjectDialogOpen] = React.useState(false)
    const [projectToAddTo, setProjectToAddTo] = React.useState<string | null>(null)

    const filteredTeamMembers = selectedDepartments.length > 0
      ? teamMembers.filter(member => selectedDepartments.includes(member.department))
      : teamMembers

    const handleMemberSelection = (memberId: string) => {
      setSelectedMembers(prev =>
        prev.includes(memberId)
          ? prev.filter(id => id !== memberId)
          : [...prev, memberId]
      )
    }

    const handleSelectAll = () => {
      setSelectedMembers(
        selectedMembers.length === filteredTeamMembers.length ? [] : filteredTeamMembers.map(member => member.id)
      )
    }

    const handleEditMember = (member: typeof teamMembers[0]) => {
      setEditingMember(member)
      setIsEditDialogOpen(true)
    }

    const handleSaveEdit = () => {
      // Implement the logic to save the edited member data
      setIsEditDialogOpen(false)
      setEditingMember(null)
    }

    const handleAddToProject = () => {
      setIsAddToProjectDialogOpen(true)
    }

    const handleApplyAddToProject = () => {
      // Implement the logic to add selected members to the chosen project
      setIsAddToProjectDialogOpen(false)
      setProjectToAddTo(null)
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="text-xl font-semibold mb-4">Team of {productionName}</h2>
          <div className="grid grid-cols-5 gap-4 p-4 border rounded-t-lg bg-muted font-semibold">
            <div className="flex items-center space-x-2 ">
              <Checkbox
                id="select-all"
                checked={selectedMembers.length === filteredTeamMembers.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Select All</Label>
            </div>
            <div className="flex items-center">Position in Production</div>
            <div className="flex items-center">Role in Production account</div>
            <div></div>
            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" disabled={selectedMembers.length === 0} onClick={handleAddToProject}>
                Add Selected to Project
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
                    <span>{member.name}</span>
                  </Label>
                </div>
                <div>{member.position}</div>
                <div>{member.role}</div>
                <div></div>
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
          <DialogContent className="sm:max-w-[450px] w-full">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={editingMember.avatar} alt={editingMember.name} />
                    <AvatarFallback>{editingMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-lg">{editingMember.name}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue={editingMember.department} onValueChange={(value) => setEditingMember({...editingMember, department: value})}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(positions).map((dep) => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select defaultValue={editingMember.position} onValueChange={(value) => setEditingMember({...editingMember, position: value})}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions[editingMember.department as keyof typeof positions].map((pos) => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={editingMember.role} onValueChange={(value) => setEditingMember({...editingMember, role: value})}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Teammate">Teammate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
              </div>
            )}
            <DialogFooter className="flex sm:justify-between pt-8">
            <div>
                  <Button variant="destructive" onClick={() => {
                    // Implement remove from production logic here
                    console.log("Removing member from production:", editingMember?.id);
                    setIsEditDialogOpen(false);
                  }}>
                    Remove from Production
                  </Button>
                </div>
                <div className='space-x-2'>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddToProjectDialogOpen} onOpenChange={setIsAddToProjectDialogOpen}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Add Selected Members to Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-select">Select Project</Label>
                <Select onValueChange={(value) => setProjectToAddTo(value)}>
                  <SelectTrigger id="project-select">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.filter(p => p.id !== 'all').map((project) => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-muted font-semibold">
                  <div>Select</div>
                  <div>Name</div>
                  <div>Position</div>
                  <div>Department</div>
                  <div>Role</div>
                </div>
                {teamMembers.filter(member => selectedMembers.includes(member.id)).map(member => (
                  <div key={member.id} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
                    <div>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleMemberSelection(member.id)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{member.name}</span>
                    </div>
                    <div className="truncate">{member.position}</div>
                    <div className="truncate">{member.department}</div>
                    <div>{member.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddToProjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleApplyAddToProject} disabled={!projectToAddTo}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

