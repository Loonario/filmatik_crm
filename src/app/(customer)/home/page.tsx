//import { ProtectedPage } from '@/components/ProtectedPage'
import  DashboardHomeComponent  from '@/components/customer/customer-home/dashboard-home-component';
import {ProfileProjects} from '@/contexts/ProfileProjectsContext'

export default function CustomerHomePage() {
  return (
    //<ProtectedPage>
      <ProfileProjects>
        <div className='p-4'>
          <DashboardHomeComponent />
        </div>
      </ProfileProjects>
    //</ProtectedPage>
  )
}