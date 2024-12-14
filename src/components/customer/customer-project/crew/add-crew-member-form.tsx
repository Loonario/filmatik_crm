import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Episode, ProData, Pro, UserProfile, DepartmentPositions } from "@/lib/api"
import { StatusItemInProject } from "@/types"

interface AddCrewMemberFormProps {
  onSubmit: (newCrewMember: ProData) => void;
  allEpisodesEpisode: Episode | null;
  departmentPositions: DepartmentPositions[];
}

export function AddCrewMemberForm({ onSubmit, allEpisodesEpisode, departmentPositions }: AddCrewMemberFormProps) {
  const [formData, setFormData] = React.useState<{
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
    fee: string;
    status: StatusItemInProject;
    image: File | null;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    fee: '',
    status: 'pre_selected',
    image: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: StatusItemInProject) => {
    setFormData(prev => ({ ...prev, status: value }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value, position: '' }))
  }

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({ ...prev, position: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleImageDelete = () => {
    setFormData(prev => ({ ...prev, image: null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedDepartment = departmentPositions.find(dep => dep.name === formData.department)
    const selectedPosition = selectedDepartment?.positions.find(pos => pos.name === formData.position)
    
    const newCrewMember: ProData = {
      user_profile: {
        id: uuidv4(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        avatar: formData.image ? URL.createObjectURL(formData.image) : '/img/placeholder.svg',
        role: 'customer',
        isPro: true,
        isVehicleOwner: false,
        isLandlord: false,
        located_at: '',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as UserProfile,
      pro: {
        id: uuidv4(),
        user_profile_id: uuidv4(),
        skills_description: '',
        experience_description: '',
        in_industry_since: new Date().toISOString(),
        showreel: '',
        department: formData.department,
        position: formData.position,
        fee: parseFloat(formData.fee),
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as Pro,
      episodes: allEpisodesEpisode ? [allEpisodesEpisode] : [],
      project_id: '',
      status: formData.status,
      department: selectedDepartment!,
      position: selectedPosition!,
      item_type: 'custom',
      contract: null,
    }
    onSubmit(newCrewMember)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="flex-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={handleDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departmentPositions.map(dep => (
                <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="position">Position</Label>
          <Select value={formData.position} onValueChange={handlePositionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {departmentPositions
                .find(dep => dep.name === formData.department)
                ?.positions.map(pos => (
                  <SelectItem key={pos.id} value={pos.name}>{pos.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="fee">Fee ($/h)</Label>
        <Input id="fee" name="fee" type="number" value={formData.fee} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre_selected">Pre-selected</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="image">Photo</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.image && (
          <div className="mt-2 relative w-20">
            <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-20 h-20 object-cover rounded" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 bg-white w-full h-full rounded p-0.5 shadow-md opacity-0 hover:opacity-90 transition-opacity"
              onClick={handleImageDelete}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Button type="submit">Add Crew Member</Button>
    </form>
  )
}