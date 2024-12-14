'use client'

import React, { useState } from 'react'
import { Episode, ProData } from "@/lib/api"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface CrewBudgetProps {
  selectedEpisode: Episode | null;
  allEpisodesEpisode: Episode | null;
  availableEpisodes: Episode[];
  crew: ProData[];
  selectedDepartments: string[];
}

export function CrewBudget({
  selectedEpisode,
  allEpisodesEpisode,
  availableEpisodes,
  crew,
  selectedDepartments
}: CrewBudgetProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const bookedCrew = crew.filter(member => 
    member.status === 'booked' && 
    (selectedDepartments.length === 0 || selectedDepartments.includes(member.department.name))
  )

  const regularEpisodes = availableEpisodes.filter(ep => !ep.isAll)

  const getEpisodeTotal = (episode: Episode) => {
    return bookedCrew
      .filter(member => member.episodes.some(ep => ep.id === episode.id) || member.episodes.some(ep => ep.isAll))
      .reduce((total, member) => {
        if (!member.contract) return total;
        const baseFee = member.contract.contract.base_fee || 0;
        const isAllEpisodes = member.episodes.some(ep => ep.isAll);
        const episodeBaseFee = isAllEpisodes ? baseFee / regularEpisodes.length : baseFee;
        const extraCosts = member.contract?.extra_costs
                .reduce((sum, cost) => {
                  if (cost.episode_id === episode.id) {
                    return sum + cost.fee;
                  } else if (cost.episode_id === allEpisodesEpisode?.id) {
                    return sum + (cost.fee / regularEpisodes.length);
                  }
                  return sum;
                }, 0) || 0;
        return total + episodeBaseFee + extraCosts;
      }, 0)
  }

  const getExtraCostsTotal = (episode: Episode) => {
    return bookedCrew
      .filter(member => member.episodes.some(ep => ep.id === episode.id) || member.episodes.some(ep => ep.isAll))
      .reduce((total, member) => {
        if (!member.contract) return total;
        return total + member.contract.extra_costs
          .reduce((sum, cost) => {
            if (cost.episode_id === episode.id) {
              return sum + cost.fee;
            } else if (cost.episode_id === allEpisodesEpisode?.id) {
              return sum + (cost.fee / regularEpisodes.length);
            }
            return sum;
          }, 0);
      }, 0)
  }

  const getTotalBudget = () => {
    return bookedCrew.reduce((total, member) => {
      if (!member.contract) return total;
      return total + member.contract.contract.total_cost;
    }, 0)
  }

  const getExtraTotalBudget = () => {
    return bookedCrew.reduce((total, member) => {
      if (!member.contract) return total;
      return total + (member.contract.contract.extra_total || 0);
    }, 0)
  }

  const handleAccordionChange = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const renderEpisodeAccordion = (episode: Episode) => {
    const episodeTotal = getEpisodeTotal(episode)
    const episodeExtraTotal = getExtraCostsTotal(episode)
    return (
      <AccordionItem value={episode.id} key={episode.id}>
        <AccordionTrigger 
          onClick={() => handleAccordionChange(episode.id)}
          className="hover:bg-secondary hover:no-underline text-lg font-semibold py-4 px-6"
        >
          <div className="flex justify-between w-full pr-4">
            <span>{episode.name}</span>
            <span>Total: ${episodeTotal.toFixed(2)} (Extra: ${episodeExtraTotal.toFixed(2)})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-2">
          <div className="grid grid-cols-5 gap-2 px-6 font-semibold mb-2 text-sm">
            <div>Name</div>
            <div>Department</div>
            <div>Position</div>
            <div className="text-right">Base Fee</div>
            <div className="text-right">Extra Costs</div>
          </div>
          {bookedCrew
            .filter(member => 
              member.episodes.some(ep => ep.id === episode.id) || 
              member.episodes.some(ep => ep.isAll) ||
              member.contract?.extra_costs.some(cost => cost.episode_id === allEpisodesEpisode?.id)
            )
            .map(member => {
              const baseFee = member.contract?.contract.base_fee || 0;
              const isAllEpisodes = member.episodes.some(ep => ep.isAll);
              let episodeBaseFee = 0;
              const getEpisodeBaseFee = () => {
                if(isAllEpisodes){
                  episodeBaseFee = baseFee / regularEpisodes.length
                }else if(member.episodes.some(ep => ep.id === episode.id)){
                  episodeBaseFee = baseFee
                }else {
                  episodeBaseFee = 0
                }
                
              } 
              getEpisodeBaseFee()
              const extraCosts = member.contract?.extra_costs
                .reduce((sum, cost) => {
                  if (cost.episode_id === episode.id) {
                    return sum + cost.fee;
                  } else if (cost.episode_id === allEpisodesEpisode?.id) {
                    return sum + (cost.fee / regularEpisodes.length);
                  }
                  return sum;
                }, 0) || 0;
              return (
                <div key={member.pro.id} className="grid grid-cols-5 px-6 gap-2 py-2 hover:bg-secondary text-sm">
                  <div>{member.user_profile.first_name} {member.user_profile.last_name}</div>
                  <div>{member.department.name}</div>
                  <div>{member.position.name}</div>
                  <div className="text-right">${episodeBaseFee.toFixed(2)}</div>
                  <div className="text-right">${extraCosts.toFixed(2)}</div>
                </div>
              )
            })
          }
        </AccordionContent>
      </AccordionItem>
    )
  }

  const episodesToRender = selectedEpisode && !selectedEpisode.isAll
    ? [selectedEpisode]
    : regularEpisodes

  return (
    <div className="space-y-4">
      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="w-full">
        {episodesToRender.map(renderEpisodeAccordion)}
      </Accordion>
      <div className="flex justify-between font-bold text-xl pt-6">
        <span>Total Budget:</span>
        <span>${getTotalBudget().toFixed(2)} (Extra: ${getExtraTotalBudget().toFixed(2)})</span>
      </div>
    </div>
  )
}