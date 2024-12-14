import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal, Settings, Trash2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Project } from '@/lib/api'
import {Category, UserRoleInProduction} from "@/types"
// import { ProjectsWithAccess } from '../project/project-layout'

interface ProjectCardProps {
  project: Project;
  category: Category;
  roleInProduction: UserRoleInProduction | null;
}


export const ProjectCard: React.FC<ProjectCardProps> = ({ project, category, roleInProduction }) => {
  const router = useRouter()

  // const handleCardOnClick = () => {
  //   router.push({
  //     pathname: "/project",
  //     query: { id: project.id },
  //   });
  // };
  // }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-1 pb-0">
      <Link href={{
  pathname: '/project',
  query: {
    project_id: project.id,
    current_category: category,
    production_id: project.production_id || null,
    role_in_production: roleInProduction || null // Change to snake_case for consistency
  }
}}>
          <Image
            src={project.cover_img || '/img/placeholder.svg'}
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
                <span>Project Settings</span>
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
}