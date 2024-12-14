import React, { useState, useCallback, useEffect, useMemo } from 'react'
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
import { Episode, ProData } from "@/lib/api"
import { Category } from "@/types"
import {categoriesNames} from "@/consts"

const localizer = momentLocalizer(moment)

interface CalendarComponentProps {
  crew: ProData[];
  availableEpisodes: Episode[];
  allEpisodesEpisode: Episode | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: Category;
  category_name: string;
}

// const sourceColors: { [key in Category]: {color: string, category_name: string} } = {
//   crew: {color: '#3498db',
//     category_name: "Crew"
//   },
//   cast: {color: '#e74c3c', category_name: "Cast"
//   },
//   locations: {color: '#2ecc71', category_name: "Locations"},
//   vehicles: {color: '#f39c12', category_name: "Vehicles"},
//   props: {color: '#9b59b6', category_name: "Props"},
//   costumes: {color: '#34495e', category_name: "Costumes"},
//   equipment: {color: '#bd2970', category_name: "Equipments"},
//   transportation: {color: '#d35400', category_name: "Transportation"},
//   special_vehicles: {color: '#8e44ad', category_name: "Special Vehicles"}
// }

export function CalendarComponent({ crew, availableEpisodes, allEpisodesEpisode }: CalendarComponentProps) {
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  //const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(new Set(Object.keys(sourceColors) as Category[]))
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(new Set((categoriesNames.map(cat => cat.value)) as Category[]))

  const events: CalendarEvent[] = useMemo(() => {
    const crewWithContracts = crew.filter(member => member.contract);
    return crewWithContracts.flatMap(member =>
      member.contract?.dates.map(date => ({
        id: `${member.pro.id}-${date.id}`,
        title: `${member.user_profile.first_name} ${member.user_profile.last_name} (${member.position.name})`,
        start: new Date(date.date_from),
        end: new Date(date.date_to),
        category: "crew" as Category,
        category_name: "Crew"
      })) || []
    );
  }, [crew])

  const toggleItem = useCallback((itemId: string) => {
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

  const toggleCategory = useCallback((category: Category) => {
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

  const toggleAllInCategory = useCallback((category: Category, checked: boolean) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      events
        .filter(item => item.category === category)
        .forEach(item => {
          if (checked) {
            newSet.add(item.id);
          } else {
            newSet.delete(item.id);
          }
        });
      return newSet;
    });
  }, [events]);

  const filteredEvents = useMemo(() => events.filter(item => visibleItems.has(item.id)), [events, visibleItems])

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const backgroundColor = categoriesNames.find(
      (category) => category.value === event.category
    )?.color || '#ccc';
    return {
      style: {
        //backgroundColor: sourceColors[event.category].color || '#ccc',
        backgroundColor
      },
    };
  }, []);

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
        <div className="w-64 mt-10 mr-4 space-y-2">
          {/* <h3 className="text-lg font-semibold">Filters</h3> */}
          {/*(Object.keys(sourceColors) as Category[]).map(category => (*/
          categoriesNames.map(category => (
            <Collapsible
              key={category.value}
              open={expandedCategories.has(category.value)}
              onOpenChange={() => toggleCategory(category.value)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full p-2 text-left cursor-pointer">
                  <div className="flex items-center">
                    {expandedCategories.has(category.value) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                    {/*sourceColors[category].category_name*/}
                    {category.name}
                  </div>
                  <Checkbox
                    checked={events.filter(item => item.category === category.value).every(item => visibleItems.has(item.id))}
                    onCheckedChange={(checked) => toggleAllInCategory(category.value, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
              {/* <Toggle
                      className="w-full justify-start"
                    >
                      TEST
                    </Toggle> */}
                {events
                  .filter(item => item.category === category.value)
                  .map(item => (
                    <Toggle
                      key={item.id}
                      pressed={visibleItems.has(item.id)}
                      onPressedChange={() => toggleItem(item.id)}
                      className="w-full justify-start text-left"
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
  );
}