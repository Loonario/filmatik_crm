'use client'

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileDown, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Episode, ProData } from '@/lib/api'
import { Category } from '@/types'

interface OverallBudgetProps {
  selectedEpisode: Episode | null;
  allEpisodesEpisode: Episode | null;
  availableEpisodes: Episode[];
  crew: ProData[];
}

interface BudgetItem {
  name: string;
  cost: number;
  episode: string;
  isExtraCost: boolean;
}

interface BudgetCategory {
  category: Category;
  items: BudgetItem[];
  name: string;
}

export function OverallBudget({ 
  selectedEpisode,
  allEpisodesEpisode,
  availableEpisodes,
  crew
}: OverallBudgetProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedExtraCosts, setExpandedExtraCosts] = useState<Record<string, boolean>>({})
  const [viewByEpisodes, setViewByEpisodes] = useState(false)

  const regularEpisodes = availableEpisodes.filter(ep => !ep.isAll)

  const budgetData = useMemo(() => {
    const categories: Record<Category, BudgetCategory> = {
      crew: { category: 'crew', items: [], name: 'Crew' },
      locations: { category: 'locations', items: [], name: 'Location' },
      vehicles: { category: 'vehicles', items: [], name: 'Vehicles' },
      props: { category: 'props', items: [], name: 'Props' },
      costumes: { category: 'costumes', items: [], name: 'Costumes' },
      equipment: { category: 'equipment', items: [], name: 'Equipment' },
      transportation: { category: 'transportation', items: [], name: 'Transportation' },
      cast: { category: 'cast', items: [], name: 'Cast' },
      special_vehicles: { category: 'special_vehicles', items: [], name: 'Special Vehicles' },
      sfx: { category: 'sfx', items: [], name: 'SFX' },
      stunts: { category: 'stunts', items: [], name: 'Stunts' },
      post_production: { category: 'post_production', items: [], name: 'Post Production' },
      other: { category: 'other', items: [], name: 'other' },
    }

    crew.forEach(member => {
      if (!member.contract) return

      const baseFee = member.contract.contract.base_fee || 0
      const isAllEpisodes = member.episodes.some(ep => ep.isAll)
      const episodeBaseFee = isAllEpisodes ? baseFee / regularEpisodes.length : baseFee

      regularEpisodes.forEach(episode => {
        if (member.episodes.some(ep => ep.id === episode.id || ep.isAll)) {
          categories.crew.items.push({
            name: `${member.user_profile.first_name} ${member.user_profile.last_name} (${member.position.name})`,
            cost: episodeBaseFee,
            episode: episode.name,
            isExtraCost: false
          })
        }
      })

      member.contract.extra_costs.forEach(cost => {
        const targetEpisodes = cost.episode_id === allEpisodesEpisode?.id ? regularEpisodes : [availableEpisodes.find(ep => ep.id === cost.episode_id)].filter(Boolean)
        targetEpisodes.forEach(episode => {
          if (episode) {
            categories.crew.items.push({
              name: `${member.user_profile.first_name} ${member.user_profile.last_name} - ${cost.comment || 'Extra Cost'}`,
              cost: cost.episode_id === allEpisodesEpisode?.id ? cost.fee / regularEpisodes.length : cost.fee,
              episode: episode.name,
              isExtraCost: true
            })
          }
        })
      })
    })

    return Object.values(categories).filter(category => category.items.length > 0)
  }, [crew, availableEpisodes, regularEpisodes, allEpisodesEpisode])

  const organizedBudgetData = useMemo(() => {
    if (viewByEpisodes) {
      const episodeMap = new Map<string, BudgetCategory[]>()
      regularEpisodes.forEach(episode => {
        episodeMap.set(episode.name, budgetData.map(category => ({
          ...category,
          items: category.items.filter(item => item.episode === episode.name)
        })))
      })
      return episodeMap
    } else {
      return new Map([['Categories', budgetData]])
    }
  }, [budgetData, regularEpisodes, viewByEpisodes])

  const filteredBudgetData = useMemo(() => {
    if (selectedEpisode?.isAll) return organizedBudgetData
    return new Map([...organizedBudgetData].map(([key, value]) => [
      key,
      value.map(category => ({
        ...category,
        items: category.items.filter(item => item.episode === selectedEpisode?.name)
      }))
    ]))
  }, [organizedBudgetData, selectedEpisode])

  const totalBudget = useMemo(() => 
    Array.from(filteredBudgetData.values()).flat().reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.cost, 0), 0
    ), [filteredBudgetData])

  const toggleCategory = (categoryKey: string, isExtraCost: boolean = false) => {
    if (isExtraCost) {
      setExpandedExtraCosts(prev => ({
        ...prev,
        [categoryKey]: !prev[categoryKey]
      }))
    } else {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryKey]: !prev[categoryKey]
      }))
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Project Budget Report', 14, 22)

    let yOffset = 30

    filteredBudgetData.forEach((categories, groupName) => {
      if (yOffset > 250) {
        doc.addPage()
        yOffset = 30
      }

      doc.setFontSize(16)
      doc.text(groupName, 14, yOffset)
      yOffset += 10

      categories.forEach(category => {
        if (category.items.length === 0) return

        const categoryTotal = category.items.reduce((sum, item) => sum + item.cost, 0)
        const tableData = [
          [{ content: `${category.name} - Total: $${categoryTotal.toLocaleString()}`, colSpan: 3, styles: { fontStyle: 'bold' } }],
          ...category.items.map(item => [item.name, item.episode, `$${item.cost.toLocaleString()}`])
        ]

        ;(doc as any).autoTable({
          startY: yOffset,
          head: [['Item', 'Episode', 'Cost']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [200, 220, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 30, bottom: 30 },
        })

        yOffset = (doc as any).lastAutoTable.finalY + 10

        if (yOffset > 250) {
          doc.addPage()
          yOffset = 30
        }
      })

      const groupTotal = categories.reduce((sum, category) => 
        sum + category.items.reduce((catSum, item) => catSum + item.cost, 0), 0
      )
      doc.setFontSize(14)
      doc.text(`${groupName} Total: $${groupTotal.toLocaleString()}`, 14, yOffset)
      yOffset += 20
    })

    doc.setFontSize(16)
    doc.text(`Total Project Budget: $${totalBudget.toLocaleString()}`, 14, yOffset)

    doc.save('project_budget_report.pdf')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Overall Budget</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          <label htmlFor="view-mode">by Categories</label>
            <Switch
              id="view-mode"
              checked={viewByEpisodes}
              onCheckedChange={setViewByEpisodes}

            />
            <label htmlFor="view-mode">by Episodes</label>
          </div>
          <Button onClick={generatePDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {Array.from(filteredBudgetData).map(([groupName, categories]) => (
          <div key={groupName} className="space-y-2">
            {viewByEpisodes && <h3 className="text-xl font-semibold mt-4">{groupName}</h3>}
            {categories.map((category) => {
              const categoryKey = `${groupName}-${category.category}`
              return (
                <Collapsible
                  key={categoryKey}
                  open={expandedCategories[categoryKey]}
                  onOpenChange={() => toggleCategory(categoryKey)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-secondary hover:bg-secondary/80 rounded-md">
                    <div className="flex items-center">
                      {expandedCategories[categoryKey] ? (
                        <ChevronDown className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="mr-2 h-4 w-4" />
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-medium">
                      ${category.items.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-2 space-y-2">
                    <div className="grid grid-cols-3 gap-2 font-semibold mb-2">
                      <div>Name</div>
                      <div>Episode</div>
                      <div className="text-right">Cost</div>
                    </div>
                    {category.items.filter(item => !item.isExtraCost).map((item, index) => (
                      <div key={`${item.name}-${item.episode}-${index}`} className="grid grid-cols-3 gap-2 items-center p-2 hover:bg-secondary/50 rounded-md">
                        <span>{item.name}</span>
                        <span>{item.episode}</span>
                        <span className="text-right">${item.cost.toLocaleString()}</span>
                      </div>
                    ))}
                    {category.items.some(item => item.isExtraCost) && (
                      <Collapsible>
                        <CollapsibleTrigger 
                          className="flex items-center justify-between w-full p-2 text-left bg-secondary/50 hover:bg-secondary/80 rounded-md"
                          onClick={() => toggleCategory(`${categoryKey}-extra`, true)}
                        >
                          <div className="flex items-center">
                            {expandedExtraCosts[`${categoryKey}-extra`] ? (
                              <ChevronDown className="mr-2 h-4 w-4" />
                            ) : (
                              <ChevronRight className="mr-2 h-4 w-4" />
                            )}
                            <span className="font-semibold">Extra Costs</span>
                          </div>
                          <span className="font-semibold">
                            ${category.items.filter(item => item.isExtraCost).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-6 mt-2 space-y-2">
                          {category.items.filter(item => item.isExtraCost).map((item, index) => (
                            <div key={`extra-${item.name}-${item.episode}-${index}`} className="grid grid-cols-3 gap-2 items-center p-2 hover:bg-secondary/50 rounded-md">
                              <span>{item.name}</span>
                              <span>{item.episode}</span>
                              <span className="text-right">${item.cost.toLocaleString()}</span>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-xl font-bold">Total Budget</span>
        <span className="text-xl font-bold">${totalBudget.toLocaleString()}</span>
      </div>
    </div>
  )
}

