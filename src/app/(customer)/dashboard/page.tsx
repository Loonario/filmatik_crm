//import { ProtectedPage } from '@/components/ProtectedPage'
import  DashboardHomeComponent  from '@/components/dashboard/dashboard-home-component';

export default function DashboardHomePage() {
  return (
    //<ProtectedPage>
<div className='p-4'>
      <DashboardHomeComponent />
      </div>
    //</ProtectedPage>
  )
}