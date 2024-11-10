'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from 'lucide-react'

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

// Mock data for booked items
const bookedItems = [
  { id: 1, title: 'Director', start: new Date(2024, 2, 1), end: new Date(2024, 2, 15), source: 'Crew' },
  { id: 2, title: 'Lead Actor 1', start: new Date(2024, 2, 5), end: new Date(2024, 2, 20), source: 'Cast' },
  { id: 3, title: 'City Park Location', start: new Date(2024, 2, 10), end: new Date(2024, 2, 12), source: 'Locations' },
  { id: 4, title: 'Camera Package', start: new Date(2024, 2, 8), end: new Date(2024, 2, 18), source: 'Equipment' },
  { id: 5, title: 'Stunt Coordinator', start: new Date(2024, 2, 15), end: new Date(2024, 2, 25), source: 'Crew' },
  { id: 6, title: 'Supporting Actor', start: new Date(2024, 2, 18), end: new Date(2024, 2, 30), source: 'Cast' },
  { id: 7, title: 'Beach Location', start: new Date(2024, 2, 22), end: new Date(2024, 2, 24), source: 'Locations' },
  { id: 8, title: 'Lighting Equipment', start: new Date(2024, 2, 20), end: new Date(2024, 2, 30), source: 'Equipment' },
]

// Define sources (categories) for the calendar
const sources = ['Crew', 'Cast', 'Locations', 'Equipment']

const sourceColors: { [key: string]: string } = {
  Crew: '#3498db',
  Cast: '#e74c3c',
  Locations: '#2ecc71',
  Equipment: '#f39c12',
}

export function CalendarComponent() {
  const [view, setView] = useState<View>(() => {
    const savedView = localStorage.getItem('calendarView')
    return (savedView as View) || 'month'
  })
  const [date, setDate] = useState(() => {
    const savedDate = localStorage.getItem('calendarDate')
    return savedDate ? new Date(savedDate) : new Date()
  })
  const [visibleItems, setVisibleItems] = useState<Set<number>>(() => {
    const savedItems = localStorage.getItem('calendarVisibleItems')
    return savedItems ? new Set(JSON.parse(savedItems)) : new Set(bookedItems.map(item => item.id))
  })
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const savedCategories = localStorage.getItem('calendarExpandedCategories')
    return savedCategories ? new Set(JSON.parse(savedCategories)) : new Set(sources)
  })

  useEffect(() => {
    localStorage.setItem('calendarVisibleItems', JSON.stringify(Array.from(visibleItems)))
  }, [visibleItems])

  useEffect(() => {
    localStorage.setItem('calendarExpandedCategories', JSON.stringify(Array.from(expandedCategories)))
  }, [expandedCategories])

  useEffect(() => {
    localStorage.setItem('calendarView', view)
  }, [view])

  useEffect(() => {
    localStorage.setItem('calendarDate', date.toISOString())
  }, [date])

  const toggleItem = useCallback((itemId: number) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }, [])

  const toggleAllInCategory = useCallback((category: string, checked: boolean) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev)
      bookedItems
        .filter(item => item.source === category)
        .forEach(item => {
          if (checked) {
            newSet.add(item.id)
          } else {
            newSet.delete(item.id)
          }
        })
      return newSet
    })
  }, [])

  const filteredEvents = bookedItems.filter(item => visibleItems.has(item.id))

  const eventStyleGetter = useCallback((event: any) => {
    return {
      style: {
        backgroundColor: sourceColors[event.source] || '#ccc',
      },
    }
  }, [])

  const CustomToolbar = ({ onView, onNavigate, label }: any) => (
    <div className="flex justify-between mb-4 items-center">
      <div>
        <Button onClick={() => onNavigate('PREV')} variant="outline" size="sm" className="mr-2">Back</Button>
        <Button onClick={() => onNavigate('TODAY')} variant="outline" size="sm">Today</Button>
        <Button onClick={() => onNavigate('NEXT')} variant="outline" size="sm" className="ml-2">Next</Button>
      </div>
      <div className="text-lg font-semibold">{label}</div>
      <div>
        <Button onClick={() => onView('month')} variant={view === 'month' ? 'default' : 'outline'} size="sm" className="mr-2">Month</Button>
        <Button onClick={() => onView('week')} variant={view === 'week' ? 'default' : 'outline'} size="sm" className="mr-2">Week</Button>
        <Button onClick={() => onView('day')} variant={view === 'day' ? 'default' : 'outline'} size="sm" className="mr-2">Day</Button>
        <Button onClick={() => onView('agenda')} variant={view === 'agenda' ? 'default' : 'outline'} size="sm">Agenda</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Project Calendar</h2>
      <div className="flex">
        <div className="w-64 mr-4 space-y-2">
          <h3 className="text-lg font-semibold">Filters</h3>
          {sources.map(category => (
            <Collapsible
              key={category}
              open={expandedCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    {expandedCategories.has(category) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                    {category}
                  </div>
                  <Checkbox
                    checked={bookedItems.filter(item => item.source === category).some(item => visibleItems.has(item.id))}
                    onCheckedChange={(checked) => toggleAllInCategory(category, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {bookedItems
                  .filter(item => item.source === category)
                  .map(item => (
                    <Toggle
                      key={item.id}
                      pressed={visibleItems.has(item.id)}
                      onPressedChange={() => toggleItem(item.id)}
                      className="w-full justify-start"
                    >
                      {item.title}
                    </Toggle>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        <div className="flex-grow" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={setView as any}
            date={date}
            onNavigate={setDate}
            components={{
              toolbar: CustomToolbar,
            }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>
    </div>
  )
}