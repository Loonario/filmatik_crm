//import { ProtectedPage } from '@/components/ProtectedPage'
import  TeamLayout  from '@/components/customer/customer-team/team-layout';
import {ProfileProjects} from '@/contexts/ProfileProjectsContext'

export default function CustomerTeamPage() {
  return (
    //<ProtectedPage>
      <ProfileProjects>
        <div className='p-4'>
          <TeamLayout />
        </div>
      </ProfileProjects>
    //</ProtectedPage>
  )
}