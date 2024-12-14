import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const NewProjectButton: React.FC = () => (
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