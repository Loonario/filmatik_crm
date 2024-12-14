'use client'

import React from 'react'
import { CrewBudget } from './crew-budget'
import { Episode, ProData } from "@/lib/api"

interface BudgetComponentProps {
  category: string;
  selectedEpisode: Episode | null;
  allEpisodesEpisode: Episode | null;
  availableEpisodes: Episode[];
  crew: ProData[];
  selectedDepartments: string[],
}

export function BudgetComponent({
  category,
  selectedEpisode,
  allEpisodesEpisode,
  availableEpisodes,
  crew,
  selectedDepartments
}: BudgetComponentProps) {
  const renderCategoryBudget = () => {
    switch (category) {
      case 'crew':
        return (
          <CrewBudget
            selectedEpisode={selectedEpisode}
            allEpisodesEpisode={allEpisodesEpisode}
            availableEpisodes={availableEpisodes}
            crew={crew}
            selectedDepartments={selectedDepartments}
          />
        )
      // Add cases for other categories here
      default:
        return <div>Budget not available for this category</div>
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Budget</h2>
      {renderCategoryBudget()}
    </div>
  )
}