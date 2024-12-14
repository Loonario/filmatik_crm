//import { ProtectedPage } from '@/components/ProtectedPage'
import  ChatsComponent  from '@/components/chats/chats-component';
import {ProfileProjects} from '@/contexts/ProfileProjectsContext'

export default function ChatsPage() {
  return (
    //<ProtectedPage>
      <ProfileProjects>
        <div className='p-4'>
          <ChatsComponent />
        </div>
      </ProfileProjects>
    //</ProtectedPage>
  )
}