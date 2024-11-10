'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal, Plus, Settings, Trash2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// Mock data for projects (now productions)
const myProjects = [
  { id: 1, name: 'Sci-Fi Epic', image: '/img/placeholder.svg' },
  { id: 2, name: 'Romantic Comedy', image: '/img/placeholder.svg' },
  { id: 3, name: 'Action Thriller', image: '/img/placeholder.svg' },
  { id: 4, name: 'Period Drama', image: '/img/placeholder.svg' },
]

const activeProjects = [
  { id: 5, name: 'Superhero Blockbuster', image: '/img/placeholder.svg' },
  { id: 6, name: 'Indie Documentary', image: '/img/placeholder.svg' },
]

const studioName = 'Stellar Studios'

interface ProjectCardProps {
  project: { id: number; name: string; image: string }
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-1 pb-0">
      <Link href={`/project?id=${project.id}`}>
        <Image
          src={project.image}
          alt={project.name}
          width={300}
          height={200}
          className="rounded-md object-cover"
        />
      </Link>
      <div className="flex h-8 items-center justify-between px-1">
        <span className="text-sm font-medium">{project.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <XCircle className="mr-2 h-4 w-4" />
              <span>Mark Complete</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Production Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
)

const NewProjectButton: React.FC = () => (
  <Button
    variant="outline"
    className="h-full w-full flex-col items-center justify-center gap-2 p-8"
    asChild
  >
    <Link href="/new-production">
      <div className="rounded-full bg-primary p-3">
        <Plus className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="mt-2">New Project</span>
    </Link>
  </Button>
)

export default function DashboardHomeComponent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold">My Projects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {myProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <NewProjectButton />
        </div>
      </section>
      <Separator />
      <section>
        <div className='flex space-x-2 items-baseline mb-4 align-text-bottom'>
        <h2 className="text-l">Projects at</h2>
        <h2 className="text-2xl font-bold">{studioName}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {activeProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <NewProjectButton />
        </div>
      </section>
    </div>
  )
}