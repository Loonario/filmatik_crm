'use client'

import React, { useState, useEffect } from 'react'
import { CrewCard, Status, CrewMember } from './crew-card'

const initialCrewMembers: CrewMember[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    position: 'Director',
    status: 'Booked',
    episodes: ['Episode 1'],
    imageUrl: '/img/placeholder.svg',
    fee: 100,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    position: 'Producer',
    status: 'preSelected',
    episodes: ['All Episodes'],
    imageUrl: '/img/placeholder.svg',
    fee: 90,
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    position: 'Cinematographer',
    status: 'Invited',
    episodes: ['Episode 2', 'Episode 3'],
    imageUrl: '/img/placeholder.svg',
    fee: 80,
  },
  // ... add more crew members as needed
]

interface CrewListProps {
  selectedEpisode: string;
  activeTab: string;
  availableEpisodes: string[];
}

export function CrewList({ selectedEpisode, activeTab, availableEpisodes }: CrewListProps) {
  const [crewMembers, setCrewMembers] = useState(initialCrewMembers)
  const [filteredCrewMembers, setFilteredCrewMembers] = useState(initialCrewMembers)

  useEffect(() => {
    const filtered = crewMembers.filter(member => 
      (selectedEpisode === 'All Episodes' || member.episodes.includes(selectedEpisode) || member.episodes.includes('All Episodes')) &&
      (activeTab === 'budget' ? member.status === 'Booked' : member.status.toLowerCase() === activeTab.toLowerCase())
    )
    setFilteredCrewMembers(filtered)
  }, [selectedEpisode, activeTab, crewMembers])

  const handleStatusChange = (id: string, newStatus: Status) => {
    setCrewMembers(prev => prev.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ))
  }

  const handleEpisodesChange = (id: string, newEpisodes: string[]) => {
    setCrewMembers(prev => prev.map(member => 
      member.id === id ? { ...member, episodes: newEpisodes } : member
    ))
  }

  const handleFeeChange = (id: string, newFee: number) => {
    setCrewMembers(prev => prev.map(member => 
      member.id === id ? { ...member, fee: newFee } : member
    ))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredCrewMembers.map(member => (
        <CrewCard 
          key={member.id}
          crewMember={member}
          onStatusChange={handleStatusChange}
          onEpisodesChange={handleEpisodesChange}
          onFeeChange={handleFeeChange}
          availableEpisodes={availableEpisodes}
        />
      ))}
    </div>
  )
}