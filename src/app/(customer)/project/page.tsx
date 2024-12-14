'use client'

import { Suspense } from 'react';
import  ProjectLayout  from '@/components/customer/customer-project/project-layout'
import { ProfileProjects, useProfileProjectsContext } from '@/contexts/ProfileProjectsContext';


function ProjectPageContent() {
  const { isLoadingContext, profile, projects } = useProfileProjectsContext();

  if (isLoadingContext) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-red-500">User profile not found. Please log in.</div>
    </div>;
  }

  if (!projects) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-red-500">No projects found.</div>
    </div>;
  }

  return <ProjectLayout />;
}

  
export default function ProjectPage() {
  return (
    <ProfileProjects>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      }>
        <ProjectPageContent />
      </Suspense>
    </ProfileProjects>
  );
}
