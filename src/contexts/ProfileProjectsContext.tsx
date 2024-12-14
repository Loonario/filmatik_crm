"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
//import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { UserProfile,
    Customer, 
    getCurrentUserProfile, 
    getCustomerData,
    getCustomerProjectsAll} from '@/lib/api'
import {CustomerProjectsAll, Production} from '@/lib/api-productions'

interface ProfileContextType {
  profile: UserProfile | null
  customer: Customer | null
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  projects: CustomerProjectsAll | null
  setProjects: React.Dispatch<React.SetStateAction<CustomerProjectsAll | null>>
  // production: Production | null
  // setProduction: React.Dispatch<React.SetStateAction<Production | null>>
  fetchUser: () => Promise<void>
  isLoadingContext: boolean
}

const ProfileProjectsContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfileProjectsContext = () => {
  const context = useContext(ProfileProjectsContext)
  if (context === undefined) {
    throw new Error('useProfileProjectsContext must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProjects: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [isLoadingContext, setIsLoadingContext] = useState(true)
    const [projects, setProjects] = useState<CustomerProjectsAll | null>(null)
    //const [production, setProduction] = useState<Production | null>(null)
  const fetchUser = async () => {
    setIsLoadingContext(true)
   try{
    const profile = await getCurrentUserProfile()
    if (!profile) throw new Error('Failed to fetch user profile')
    if(profile){
        setProfile(profile);
        if (profile.role === 'customer') {
            const customerData = await getCustomerData(profile.id)
            if (customerData) {
                setCustomer(customerData)
                const customerProjects = await getCustomerProjectsAll(customerData.id, customerData.access_to_categories)
                if(customerProjects){
                  setProjects(customerProjects)
                }
            }
        }
    }
   }catch(err){
    console.error('Error fetching profile:', err)
   }
   setIsLoadingContext(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

//   const supabase = createClientComponentClient()

//   const fetchProfile = async () => {
//     setIsLoading(true)
//     const { data: { session } } = await supabase.auth.getSession()
//     if (session) {
//       const { data, error } = await supabase
//         .from('profile')
//         .select('*')
//         .eq('id', session.user.id)
//         .single()

//       if (error) {
//         console.error('Error fetching profile:', error)
//       } else {
//         setProfile(data)
//       }
//     }
//     setIsLoading(false)
//   }

//   useEffect(() => {
//     fetchProfile()
//   }, [])

  return (
    <ProfileProjectsContext.Provider value={{ 
      profile, 
    setProfile, 
    customer, 
    setCustomer, 
    projects, 
    setProjects, 
    fetchUser, 
    // production,
    // setProduction,
    isLoadingContext,
     }}>
      {children}
    </ProfileProjectsContext.Provider>
  )
}

