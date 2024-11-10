'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { FileDown, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Mock data for the budget
const budgetData = [
  {
    category: 'Crew',
    items: [
      { name: 'Director', cost: 10000, episode: 'Episode 1' },
      { name: 'Cameraman', cost: 5000, episode: 'Episode 1' },
      { name: 'Sound Engineer', cost: 3000, episode: 'Episode 1' },
      { name: 'Director', cost: 10000, episode: 'Episode 2' },
      { name: 'Cameraman', cost: 5000, episode: 'Episode 2' },
      { name: 'Sound Engineer', cost: 3000, episode: 'Episode 2' },
    ],
  },
  {
    category: 'Cast',
    items: [
      { name: 'Lead Actor', cost: 15000, episode: 'Episode 1' },
      { name: 'Supporting Actor', cost: 7000, episode: 'Episode 1' },
      { name: 'Lead Actor', cost: 15000, episode: 'Episode 2' },
      { name: 'Supporting Actor', cost: 7000, episode: 'Episode 2' },
    ],
  },
  {
    category: 'Locations',
    items: [
      { name: 'City Park', cost: 2000, episode: 'Episode 1' },
      { name: 'Beach', cost: 3000, episode: 'Episode 2' },
    ],
  },
  {
    category: 'Equipment',
    items: [
      { name: 'Camera Package', cost: 5000, episode: 'Episode 1' },
      { name: 'Lighting Equipment', cost: 3000, episode: 'Episode 1' },
      { name: 'Camera Package', cost: 5000, episode: 'Episode 2' },
      { name: 'Lighting Equipment', cost: 3000, episode: 'Episode 2' },
    ],
  },
]

export function OverallBudget({ selectedEpisode }: { selectedEpisode: string }) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set())

  const filteredBudgetData = selectedEpisode === 'All Episodes'
    ? budgetData
    : budgetData.map(category => ({
        ...category,
        items: category.items.filter(item => item.episode === selectedEpisode)
      }))

  const totalBudget = filteredBudgetData.reduce((sum, category) => 
    sum + category.items.reduce((catSum, item) => catSum + item.cost, 0), 0
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Project Budget Report', 14, 22)

    const episodes = Array.from(new Set(budgetData.flatMap(category => category.items.map(item => item.episode))))

    episodes.forEach((episode, index) => {
      if (index > 0) {
        doc.addPage()
      }

      let yOffset = 30
      doc.setFontSize(16)
      doc.text(`${episode}`, 14, yOffset)
      yOffset += 10

      const episodeData = budgetData.map(category => ({
        ...category,
        items: category.items.filter(item => item.episode === episode)
      })).filter(category => category.items.length > 0)

      const episodeTotal = episodeData.reduce((sum, category) => 
        sum + category.items.reduce((catSum, item) => catSum + item.cost, 0), 0
      )

      episodeData.forEach(category => {
        const categoryTotal = category.items.reduce((sum, item) => sum + item.cost, 0)
        const tableData = [
          [{ content: `${category.category} - Total: $${categoryTotal.toLocaleString()}`, colSpan: 2, styles: { fontStyle: 'bold' } }],
          ...category.items.map(item => [item.name, `$${item.cost.toLocaleString()}`])
        ]

        ;(doc as any).autoTable({
          startY: yOffset,
          head: [['Item', 'Cost']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [200, 220, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 30, bottom: 30 },
        })

        yOffset = (doc as any).lastAutoTable.finalY + 10
      })

      doc.setFontSize(14)
      doc.text(`Episode Total: $${episodeTotal.toLocaleString()}`, 14, yOffset)
    })

    doc.addPage()
    doc.setFontSize(16)
    doc.text(`Total Project Budget: $${totalBudget.toLocaleString()}`, 14, 30)

    doc.save('project_budget_report.pdf')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Overall Budget</h2>
        <Button onClick={generatePDF}>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="space-y-2">
        {filteredBudgetData.map((category) => (
          <Collapsible
            key={category.category}
            open={expandedCategories.has(category.category)}
            onOpenChange={() => toggleCategory(category.category)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-secondary hover:bg-secondary/80 rounded-md">
              <div className="flex items-center">
                {expandedCategories.has(category.category) ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <span className="font-medium">{category.category}</span>
              </div>
              <span className="font-medium">
                ${category.items.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 mt-2 space-y-2">
              {category.items.map((item, index) => (
                <div key={`${item.name}-${item.episode}-${index}`} className="flex justify-between items-center p-2 hover:bg-secondary/50 rounded-md">
                  <span>{item.name} ({item.episode})</span>
                  <span>${item.cost.toLocaleString()}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-xl font-bold">Total Budget</span>
        <span className="text-xl font-bold">${totalBudget.toLocaleString()}</span>
      </div>
    </div>
  )
}