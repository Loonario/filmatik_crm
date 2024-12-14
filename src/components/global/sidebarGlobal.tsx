'use client'

import * as React from 'react'
import Link from 'next/link'
import { Home, Users, MessageCircle, Bell, HelpCircle, Lightbulb, Settings, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarProvider,
  // SidebarTrigger,
  // SidebarRail,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator"
import { AvatarCust, AvatarFallbackCust, AvatarImageCust } from "@/components/ui/avatar-customized"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCurrentUserProfile, UserProfile } from '@/lib/api'

const SidebarIcon = ({ icon: Icon, label, href = "#" }: { icon: React.ElementType, label: string, href?: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="mb-2">
        <Link href={href} className={cn(
          "flex h-12 w-12 items-center justify-center rounded-md",
          "hover:bg-muted transition-colors"
        )}>
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
       </Link>
    </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function SidebarGlobalComponent() {
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
      } catch (err) {
        setError('Failed to fetch user profile.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserProfile()
  }, [])

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="flex flex-col items-center py-4">
        <SidebarIcon icon={Home} label="Home" href={"/"}/>
        <SidebarIcon icon={Users} label="Team" href={"/team"}/>
        <SidebarIcon icon={MessageCircle} label="Chats" href={"/chats"}/>
        <SidebarIcon icon={Bell} label="Notifications" href={"/notifications"}/>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter className="flex flex-col items-center py-4">
        <SidebarIcon icon={HelpCircle} label="Support" href={"#"}/>
        <SidebarIcon icon={Lightbulb} label="Send feature request" href={"#"}/>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex h-10 w-10 bg-muted rounded-lg overflow-hidden justify-center items-center border" >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="relative w-full p-0">
                      <AvatarCust>
                        <AvatarImageCust src={userProfile?.avatar || "/img/customer_ava.jpg"} alt={userProfile?.first_name || "User"}/>
                        <AvatarFallbackCust className='h-full'>{userProfile?.first_name?.[0] || 'U'}</AvatarFallbackCust>
                      </AvatarCust>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Account and Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end" side='right'>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 bg-muted rounded-full overflow-hidden justify-center items-center border" >
                <Button variant="ghost" size="icon" className="w-full">
                  <AvatarCust>
                    <AvatarImageCust src={userProfile?.avatar || "/img/customer_ava.jpg"} alt={userProfile?.first_name || "User"} />
                    <AvatarFallbackCust className='h-full' >{userProfile?.first_name?.[0] || 'U'}</AvatarFallbackCust>
                  </AvatarCust>
                </Button>
              </div>
              <div className="mt-2 text-sm font-medium">{userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Loading...'}</div>
              <Button variant="ghost" size="sm" className="mt-4 w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  )
}