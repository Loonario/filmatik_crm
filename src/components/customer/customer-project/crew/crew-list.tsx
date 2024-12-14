'use client'

import React, { useState, useEffect } from 'react'
import { CrewCard } from './crew-card'
import {Episode, ProData, DepartmentPositions, Customer} from "@/lib/api"
import {UserRole, ProjectStatus, StatusItemInProject} from "@/types"

interface CrewListProps {
  selectedEpisode: Episode | null;
  allEpisodesEpisode: Episode | null;
  activeTab: StatusItemInProject | "budget";
  availableEpisodes: Episode[];
  crewMembers: ProData[];
  onStatusChange: (id: string, newStatus: StatusItemInProject) => void;
  onEpisodesChange: (id: string, newEpisodes: Episode[]) => void;
  onEpisodeChange: (episode: Episode) => void;
  onUpdateDepartment: (id: string, newDepartment: string) => void;
  onUpdatePosition: (id: string, newPosition: string) => void;
  onUpdateCrewMember: (updatedCrewMember: ProData) => void;
  departmentPositions: DepartmentPositions[];
  customer: Customer | null;
}


export function CrewList({ 
  selectedEpisode, 
  activeTab, 
  availableEpisodes, 
  crewMembers, 
  allEpisodesEpisode, 
  onStatusChange, 
  onEpisodesChange,
  onEpisodeChange,
  onUpdateDepartment,
  onUpdatePosition,
  onUpdateCrewMember,
  departmentPositions,
  customer
}: CrewListProps) {
  const [filteredCrewMembers, setFilteredCrewMembers] = useState(crewMembers)

  useEffect(() => {
    const filtered = crewMembers.filter(member => 
      (selectedEpisode?.isAll || member.episodes.some(ep => ep.isAll) || member.episodes.some(ep => ep.id === selectedEpisode?.id)) &&
      (activeTab === 'budget' ? member.status === 'booked' : member.status === activeTab)
    )
    setFilteredCrewMembers(filtered)
  }, [selectedEpisode, activeTab, crewMembers])


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {filteredCrewMembers.map(member => (
        <CrewCard 
          key={member.pro.id}
          crewMember={member}
          onStatusChange={onStatusChange}
          onEpisodesChange={onEpisodesChange}
          availableEpisodes={availableEpisodes}
          allEpisodesEpisode={allEpisodesEpisode}
          onEpisodeChange={onEpisodeChange}
          onUpdateDepartment={onUpdateDepartment}
          onUpdatePosition={onUpdatePosition}
          departmentPositions={departmentPositions}
          onUpdateCrewMember={onUpdateCrewMember}
          customer={customer}
        />
      ))}
    </div>
  )
}