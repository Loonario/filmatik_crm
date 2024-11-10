'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { CrewList } from './crew/crew-list'

// Mock data for categories (unchanged)
const categoryData: Record<string, Record<string, any[]>> = {
  // ... (keep the existing mock data)
}

interface DashboardProjectComponentProps {
  category: string;
  selectedEpisode: string;
  availableEpisodes: string[];
}

export function DashboardProjectComponent({ category, selectedEpisode, availableEpisodes }: DashboardProjectComponentProps) {
  const [activeTab, setActiveTab] = React.useState('preSelected')

  const filterItemsByEpisode = (items: any[]) => {
    if (selectedEpisode === 'All Episodes') {
      return items
    }
    return items.filter(item => item.episode === selectedEpisode)
  }

  const renderCategoryContent = () => {
    if (activeTab === 'budget') {
      const bookedItems = filterItemsByEpisode(categoryData[category]?.booked || [])
      const total = bookedItems.reduce((sum, item) => sum + (item.cost || 0), 0)

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Episode</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.episode}</TableCell>
                <TableCell className="text-right">${item.cost?.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">${total.toLocaleString()}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
    }

    if (category === 'crew') {
      return <CrewList selectedEpisode={selectedEpisode} activeTab={activeTab} availableEpisodes={availableEpisodes} />
    }

    const items = filterItemsByEpisode(categoryData[category]?.[activeTab] || [])
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>{Object.entries(item)
                .filter(([key, value]) => key !== 'id' && key !== 'name' && key !== 'status' && key !== 'episode')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{item.status}</p>
              <p className="text-sm text-muted-foreground">{item.episode}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preSelected" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preSelected">Pre-selected</TabsTrigger>
          <TabsTrigger value="Invited">Invited</TabsTrigger>
          <TabsTrigger value="Booked">Booked</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="preSelected">{renderCategoryContent()}</TabsContent>
        <TabsContent value="Invited">{renderCategoryContent()}</TabsContent>
        <TabsContent value="Booked">{renderCategoryContent()}</TabsContent>
        <TabsContent value="budget">{renderCategoryContent()}</TabsContent>
      </Tabs>
    </div>
  )
}