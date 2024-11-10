'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, UserCircle2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export type Status = 'preSelected' | 'Invited' | 'Booked'

export interface CrewMember {
  id: string
  firstName: string
  lastName: string
  position: string
  status: Status
  episodes: string[]
  imageUrl: string
  fee: number
}

interface CrewCardProps {
  crewMember: CrewMember
  onStatusChange: (id: string, newStatus: Status) => void
  onEpisodesChange: (id: string, newEpisodes: string[]) => void
  onFeeChange: (id: string, newFee: number) => void
  availableEpisodes: string[]
}

export function CrewCard({ crewMember, onStatusChange, onEpisodesChange, onFeeChange, availableEpisodes }: CrewCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempFee, setTempFee] = useState(crewMember.fee)
  const [isFeeChanged, setIsFeeChanged] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    setTempFee(crewMember.fee)
    setIsFeeChanged(false)
  }, [crewMember.fee])

  const handleFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = parseFloat(event.target.value)
    setTempFee(newFee)
    setIsFeeChanged(newFee !== crewMember.fee)
  }

  const applyFeeChange = () => {
    onFeeChange(crewMember.id, tempFee)
    setIsFeeChanged(false)
  }

  const handleAddEpisode = () => {
    if (selectedEpisode === 'All Episodes') {
      if (crewMember.episodes.length > 0) {
        toast({
          title: "Cannot add All Episodes",
          description: "Please clear the list of episodes first.",
          duration: 3000,
        })
        return
      }
      onEpisodesChange(crewMember.id, ['All Episodes'])
    } else if (selectedEpisode && !crewMember.episodes.includes(selectedEpisode)) {
      if (crewMember.episodes.includes('All Episodes')) {
        onEpisodesChange(crewMember.id, [selectedEpisode])
      } else {
        onEpisodesChange(crewMember.id, [...crewMember.episodes, selectedEpisode])
      }
    }
    setSelectedEpisode('')
  }

  const handleRemoveEpisode = (episode: string) => {
    onEpisodesChange(crewMember.id, crewMember.episodes.filter(e => e !== episode))
  }

  const getEpisodesDisplay = (episodes: string[]) => {
    if (episodes.includes('All Episodes')) return 'All Episodes'
    if (episodes.length === 1) return episodes[0]
    return 'Multiple Episodes'
  }

  const handleStatusChange = (value: Status) => {
    onStatusChange(crewMember.id, value)
  }

  const selectableEpisodes = ['All Episodes', ...availableEpisodes.filter(ep => !crewMember.episodes.includes(ep))]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className="w-[250px] cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 space-y-4">
            <img src={crewMember.imageUrl || "/img/placeholder.svg"} alt={`${crewMember.firstName} ${crewMember.lastName}`} className="w-full h-40 object-cover rounded-md" />
            <div>
              <h3 className="font-semibold">{`${crewMember.firstName} ${crewMember.lastName}`}</h3>
              <div className='flex justify-between w-full items-center'>
                <p className="text-sm text-gray-500">{crewMember.position}</p>
                <Button variant="ghost" size="sm" className="p-0">
                  <UserCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select
              value={crewMember.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preSelected">Pre-selected</SelectItem>
                <SelectItem value="Invited">Invited</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <p className="text-sm font-semibold mb-1">Episodes:</p>
              <p className="text-sm">{getEpisodesDisplay(crewMember.episodes)}</p>
            </div>
            <p className="text-sm font-semibold">Fee: ${crewMember.fee}/h</p>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full pr-4">
          <SheetHeader>
            <SheetTitle>{`${crewMember.firstName} ${crewMember.lastName}`}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <img src="/img/editor_ava.jpg" alt={`${crewMember.firstName} ${crewMember.lastName}`} className="w-32 h-32 object-cover rounded-full mx-auto" />
            <div className='flex justify-between w-full items-center'>
              <p><strong>Position:</strong> {crewMember.position}</p>
              <Button>Profile</Button>
            </div>
            <div>
              <p className="mb-2"><strong>Status:</strong></p>
              <Select
                value={crewMember.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preSelected">Pre-selected</SelectItem>
                  <SelectItem value="Invited">Invited</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-2"><strong>Episodes:</strong></p>
              <div className="flex items-center space-x-2 mb-2">
                <Select
                  value={selectedEpisode}
                  onValueChange={setSelectedEpisode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select episode" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableEpisodes.map((episode) => (
                      <SelectItem key={episode} value={episode}>{episode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEpisode} disabled={!selectedEpisode || crewMember.episodes.includes(selectedEpisode)}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {crewMember.episodes.map((episode) => (
                  <div key={episode} className="flex items-center justify-between bg-secondary p-2 rounded">
                    <span>{episode}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveEpisode(episode)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2"><strong>Fee ($/h):</strong></p>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={tempFee}
                  onChange={handleFeeChange}
                  className="w-24"
                />
                <Button onClick={applyFeeChange} disabled={!isFeeChanged}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}