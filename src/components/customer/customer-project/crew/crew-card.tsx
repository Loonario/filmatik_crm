'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, UserCircle2, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Episode, ProData, DepartmentPositions, Customer} from "@/lib/api"
import {ContractProjectPro, ContractDateRange, ContractPro, ContractExtraCost } from "@/lib/api-contracts"
import { StatusItemInProject } from "@/types"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface CrewCardProps {
  crewMember: ProData;
  onStatusChange: (id: string, newStatus: StatusItemInProject) => void;
  onEpisodesChange: (id: string, newEpisodes: Episode[]) => void;
  onUpdateDepartment: (id: string, newDepartment: string) => void;
  onUpdatePosition: (id: string, newPosition: string) => void;
  onUpdateCrewMember: (updatedCrewMember: ProData) => void;
  availableEpisodes: Episode[];
  allEpisodesEpisode: Episode | null;
  onEpisodeChange: (episode: Episode) => void;
  departmentPositions: DepartmentPositions[];
  customer: Customer | null;
}
interface BookingDateRange extends Required<DateRange> {
  from: Date;
  to: Date;
}

export function CrewCard({ 
  crewMember, 
  onStatusChange, 
  onEpisodesChange, 
  onUpdateDepartment,
  onUpdatePosition,
  onUpdateCrewMember,
  availableEpisodes,
  allEpisodesEpisode,
  onEpisodeChange,
  departmentPositions,
  customer
}: CrewCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStatus, setTempStatus] = useState<StatusItemInProject>(crewMember.status)
  const [tempEpisodes, setTempEpisodes] = useState<Episode[]>(crewMember.episodes)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [tempDepartment, setTempDepartment] = useState(crewMember.department.name)
  const [tempPosition, setTempPosition] = useState(crewMember.position.name)
  const [tempFirstName, setTempFirstName] = useState(crewMember.user_profile.first_name)
  const [tempLastName, setTempLastName] = useState(crewMember.user_profile.last_name)
  const [tempFee, setTempFee] = useState(crewMember.pro.fee)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [dateRanges, setDateRanges] = useState<(DateRange | undefined)[]>([undefined])
  const [bookingComments, setBookingComments] = useState<string[]>([''])
  const [extraCosts, setExtraCosts] = useState<ContractExtraCost[]>(
    crewMember.contract?.extra_costs || []
  )
  const [isBookingApplied, setIsBookingApplied] = useState(false)
   // Track popup state for each extra cost calendar
   const [openCalendars, setOpenCalendars] = useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()

  useEffect(() => {
    setTempStatus(crewMember.status)
    setTempEpisodes(crewMember.episodes)
    setTempDepartment(crewMember.department.name)
    setTempPosition(crewMember.position.name)
    setTempFirstName(crewMember.user_profile.first_name)
    setTempLastName(crewMember.user_profile.last_name)
    setTempFee(crewMember.pro.fee)
    setDateRanges(crewMember.contract?.dates.map(date => ({
      from: new Date(date.date_from),
      to: new Date(date.date_to)
    })) || [undefined])
    setBookingComments(crewMember.contract?.dates.map(date => date.comment || '') || [''])
    setExtraCosts(crewMember.contract?.extra_costs || [])
    setIsBookingApplied(false)
  }, [crewMember])


  const handleStatusChange = (value: StatusItemInProject) => {
    if (value === 'booked' && tempStatus !== 'booked') {
      setIsBookingDialogOpen(true)
    } else if (tempStatus === 'booked' && value !== 'booked') {
      const updatedCrewMember: ProData = {
        ...crewMember,
        status: value,
        contract: null,
      }
      onUpdateCrewMember(updatedCrewMember)
    }else {
      setTempStatus(value)
      onStatusChange(crewMember.pro.id, value)
    }
  }

  const calculateTotalCost = (baseFee: number, extraCosts: ContractExtraCost[]) => {
    const extraTotal = extraCosts.reduce((total, cost) => total + cost.fee, 0)
    return baseFee + extraTotal
  }

  const handleBooking = () => {
    const validDateRanges = dateRanges.filter((range): range is BookingDateRange => 
      range !== undefined && range.from !== undefined && range.to !== undefined
    )
    
    if (validDateRanges.length === 0) {
      toast({
        title: "Booking Error",
        description: "Please select at least one valid date range.",
        duration: 3000,
      })
      return
    }

    const totalCost = calculateTotalCost(tempFee, extraCosts)
    const extraTotal = extraCosts.reduce((total, cost) => total + cost.fee, 0)

    const newContract: ContractProjectPro = {
      id: uuidv4(),
      customer_id: customer?.id || null, 
      pro_id: crewMember.pro.id,
      position_id: crewMember.position.id,
      department_id: crewMember.department.id,
      production_id: null,
      project_id: crewMember.project_id,
      contract_status: 'accepted',
      base_fee: tempFee,
      extra_total: extraTotal,
      total_cost: totalCost,
      payment_id: null,
      payed_at: null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const newDateRanges: ContractDateRange[] = validDateRanges.map((range, index) => ({
      id: uuidv4(),
      contract_id: newContract.id,
      date_from: range.from.toISOString(),
      date_to: range.to.toISOString(),
      comment: bookingComments[index] || null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }))

    // Ensure extra costs are properly distributed for "All Episodes"
    const processedExtraCosts = extraCosts.map(cost => ({
      ...cost,
      contract_id: newContract.id,
      // If the cost is for all episodes, keep the original fee
      // The budget component will handle the per-episode division
      fee: cost.episode_id === allEpisodesEpisode?.id ? cost.fee : cost.fee
    }))

    const newContractPro: ContractPro = {
      contract: newContract,
      dates: newDateRanges,
      extra_costs: processedExtraCosts,
    }

    const updatedCrewMember: ProData = {
      ...crewMember,
      status: 'booked',
      contract: newContractPro,
    }

    onUpdateCrewMember(updatedCrewMember)
    setTempStatus('booked')
    setIsBookingDialogOpen(false)
    setIsBookingApplied(true)
    toast({
      title: "Booking Successful",
      description: "The crew member has been booked successfully.",
      duration: 3000,
    })
  }

  const handleAddDateRange = () => {
    setDateRanges([...dateRanges, undefined])
    setBookingComments([...bookingComments, ''])
  }

  const handleRemoveDateRange = (index: number) => {
    const newDateRanges = [...dateRanges]
    newDateRanges.splice(index, 1)
    setDateRanges(newDateRanges)

    const newBookingComments = [...bookingComments]
    newBookingComments.splice(index, 1)
    setBookingComments(newBookingComments)
  }

  const handleAddExtraCost = () => {
    setExtraCosts(prevCosts => [...prevCosts, {
      id: uuidv4(),
      contract_id: crewMember.contract?.contract.id || '',
      date_from: null,
      date_to: null,
      comment: null,
      fee: 0,
      episode_id: availableEpisodes[0].id,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }])
  }

  const handleRemoveExtraCost = (index: number) => {
    const newExtraCosts = [...extraCosts]
    newExtraCosts.splice(index, 1)
    setExtraCosts(newExtraCosts)
  }

  const handleUpdateExtraCost = (index: number, field: keyof ContractExtraCost, value: any) => {
    setExtraCosts(prevCosts => {
      const newCosts = [...prevCosts]
      if (field === 'date_from' || field === 'date_to') {
        newCosts[index] = {
          ...newCosts[index],
          [field]: value
        }
      } else {
        newCosts[index] = {
          ...newCosts[index],
          [field]: value
        }
      }
      return newCosts
    })
  }

  const formatDateRange = (from: string | null, to: string | null) => {
    if (!from) return "Pick a date range (optional)"
    if (!to) return format(new Date(from), "LLL dd, y")
    return `${format(new Date(from), "LLL dd, y")} - ${format(new Date(to), "LLL dd, y")}`
  }

  const handleAddEpisode = () => {
    if (selectedEpisode) {
      if (selectedEpisode.isAll) {
        setTempEpisodes([selectedEpisode])
      } else if (tempEpisodes.length === 1 && tempEpisodes[0].isAll) {
        setTempEpisodes([selectedEpisode])
      } else if (!tempEpisodes.some(ep => ep.isAll)) {
        if (!tempEpisodes.some(ep => ep.id === selectedEpisode.id)) {
          setTempEpisodes(prev => [...prev, selectedEpisode])
          if (allEpisodesEpisode && availableEpisodes.length - 1 === tempEpisodes.length + 1) {
            setTempEpisodes([allEpisodesEpisode])
          }
        }
      } else {
        toast({
          title: "Cannot add episode",
          description: "All Episodes is already selected. Remove it first to add individual episodes.",
          duration: 3000,
        })
      }
      setSelectedEpisode(null)
    }
  }

  const handleRemoveEpisode = (episode: Episode) => {
    if (tempEpisodes.length > 1) {
      if (episode.isAll) {
        setTempEpisodes([])
      } else {
        setTempEpisodes(prev => prev.filter(ep => ep.id !== episode.id))
      }
    } else {
      toast({
        title: "Cannot remove episode",
        description: "At least one episode must be selected.",
        duration: 3000,
      })
    }
  }

  const handleSheetOpenChange = (open: boolean) => {
    const totalCost = calculateTotalCost(tempFee, extraCosts)
    const extraTotal = extraCosts.reduce((total, cost) => total + cost.fee, 0)

    const updatedCrewMember: ProData = {
      ...crewMember,
      status: tempStatus,
      episodes: tempEpisodes,
      department: { ...crewMember.department, name: tempDepartment },
      position: { ...crewMember.position, name: tempPosition },
      user_profile: {
        ...crewMember.user_profile,
        first_name: tempFirstName,
        last_name: tempLastName,
      },
      pro: {
        ...crewMember.pro,
        fee: tempFee,
      },
      contract: tempStatus === 'booked' && isBookingApplied ? {
        ...crewMember.contract!,
        contract: {
          ...crewMember.contract!.contract,
          base_fee: tempFee,
          extra_total: extraTotal,
          total_cost: totalCost,
        },
          dates: dateRanges
            .filter((range): range is BookingDateRange => range !== undefined && range.from !== undefined && range.to !== undefined)
            .map((range, index) => ({
              id: crewMember.contract!.dates[index]?.id || uuidv4(),
              contract_id: crewMember.contract!.contract.id,
              date_from: range.from.toISOString(),
              date_to: range.to.toISOString(),
              comment: bookingComments[index] || null,
              updated_at: new Date().toISOString(),
              created_at: crewMember.contract!.dates[index]?.created_at || new Date().toISOString(),
            })),
          extra_costs: extraCosts,
        } : crewMember.contract,
      }
      onUpdateCrewMember(updatedCrewMember)
    
    setIsOpen(open)
  }


  // const handleApplyFee = () => {
  //   setTempFee(tempFee)
  //   toast({
  //     title: "Fee updated",
  //     description: `Fee has been updated to $${tempFee}/project.`,
  //     duration: 3000,
  //   })
  // }

  const getEpisodesDisplay = (episodes: Episode[]) => {
    if (episodes.some(ep => ep.isAll)) return 'All Episodes'
    if (episodes.length === 1) return episodes[0].name
    return 'Multiple Episodes'
  }

  const selectableEpisodes = [
    ...(allEpisodesEpisode ? [allEpisodesEpisode] : []),
    ...availableEpisodes.filter(ep => 
      !tempEpisodes.some(tempEp => tempEp.id === ep.id) && !ep.isAll
    )
  ]


  const renderBookingSection = () => (
    <div className="flex flex-col space-y-4 w-full">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <Button onClick={handleAddDateRange}>Add Date Range</Button>
        {dateRanges.map((range, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !range?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {range?.from ? (
                      range.to ? (
                        <>
                          {format(range.from, "LLL dd, y")} -{" "}
                          {format(range.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(range.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={(newRange) => {
                      const newDateRanges = [...dateRanges]
                      newDateRanges[index] = newRange
                      setDateRanges(newDateRanges)
                    }}
                    numberOfMonths={2}
                    
                        
                        disabled={(date) => false}
                        captionLayout="dropdown-buttons"
                        fromYear={2024}
                        toYear={2034}
                        // components={calendarComponents}
                        classNames={{
                          months: "flex space-x-4 text-sm",
                          month: "space-y-6",
                          caption: "flex flex-row justify-center items-center relative h-10",
                          caption_label: "hidden", // Hide the default label
                          nav: "", // Hide the navigation buttons
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal ",
                          cell: cn(
                            "h-9 w-9 text-center text-sm relative p-0 rounded-md",
                            "hover:bg-accent hover:text-accent-foreground"
                          ),
                        }}
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={() => handleRemoveDateRange(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Comment"
              value={bookingComments[index]}
              onChange={(e) => {
                const newComments = [...bookingComments]
                newComments[index] = e.target.value
                setBookingComments(newComments)
              }}
            />
          </div>
        ))}
        <h4 className="text-md font-semibold">Extra Costs</h4>
        {extraCosts.map((cost, index) => {
          const fromDate = cost.date_from ? new Date(cost.date_from) : undefined
          const toDate = cost.date_to ? new Date(cost.date_to) : undefined
          
          return (
            <div key={index} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Popover 
                  open={openCalendars[index]} 
                  onOpenChange={(open) => {
                    setOpenCalendars(prev => ({...prev, [index]: open}))
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !cost.date_from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateRange(cost.date_from, cost.date_to)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="range"
                        selected={{
                          from: fromDate,
                          to: toDate
                        }}
                        defaultMonth={fromDate || new Date()}
                        onSelect={(newRange) => {
                          if (!newRange || (!newRange.from && !newRange.to)) {
                            handleUpdateExtraCost(index, 'date_from', null)
                            handleUpdateExtraCost(index, 'date_to', null)
                            return
                          }

                          if (newRange.from) {
                            const fromDate = new Date(newRange.from)
                            fromDate.setHours(0, 0, 0, 0)
                            handleUpdateExtraCost(index, 'date_from', fromDate.toISOString())
                          }

                          if (newRange.to) {
                            const toDate = new Date(newRange.to)
                            toDate.setHours(23, 59, 59, 999)
                            handleUpdateExtraCost(index, 'date_to', toDate.toISOString())
                          } else if (newRange.from) {
                            const sameDate = new Date(newRange.from)
                            sameDate.setHours(23, 59, 59, 999)
                            handleUpdateExtraCost(index, 'date_to', sameDate.toISOString())
                          }
                        }}
                        initialFocus
                        numberOfMonths={2}
                        disabled={(date) => false}
                        captionLayout="dropdown-buttons"
                        fromYear={2024}
                        toYear={2034}
                        // components={calendarComponents}
                        classNames={{
                          months: "flex space-x-4 text-sm",
                          month: "space-y-6",
                          caption: "flex flex-row justify-center items-center relative h-10",
                          caption_label: "hidden", // Hide the default label
                          nav: "", // Hide the navigation buttons
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal ",
                          cell: cn(
                            "h-9 w-9 text-center text-sm relative p-0 rounded-md",
                            "hover:bg-accent hover:text-accent-foreground"
                          ),
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Button onClick={() => handleRemoveExtraCost(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            
            <Textarea
              placeholder="Comment (optional)"
              value={cost.comment || ''}
              onChange={(e) => handleUpdateExtraCost(index, 'comment', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Fee"
              value={cost.fee}
              onChange={(e) => handleUpdateExtraCost(index, 'fee', Number(e.target.value))}
            />
            <Select
              value={cost.episode_id}
              onValueChange={(value) => handleUpdateExtraCost(index, 'episode_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select episode" />
              </SelectTrigger>
              <SelectContent>
                {availableEpisodes.map((episode) => (
                  <SelectItem key={episode.id} value={episode.id}>
                    {episode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      })}
      <Button onClick={handleAddExtraCost}>
        <Plus className="h-4 w-4 mr-2" /> Add Extra Cost
      </Button>
      </div>
      <Button onClick={handleBooking}>Apply Booking Details</Button>
    </div>
  )
  

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Card className="w-[250px] cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-4">
              <img src={crewMember.user_profile.avatar || "/img/placeholder.svg"} alt={`${crewMember.user_profile.first_name} ${crewMember.user_profile.last_name}`} className="w-full h-40 object-cover rounded-md" />
              <div>
                <h3 className="font-semibold">{`${crewMember.user_profile.first_name} ${crewMember.user_profile.last_name}`}</h3>
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-500">{crewMember.department.name}</p>
                  <p className="text-sm text-gray-500">{crewMember.position.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Episodes:</p>
                <p className="text-sm">{getEpisodesDisplay(crewMember.episodes)}</p>
              </div>
              <p className="text-sm font-semibold">Fee: {crewMember.status !== "booked" ? crewMember.pro.fee : crewMember.contract?.contract.base_fee}/project</p>
              <Select
                value={tempStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre_selected">Pre-selected</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent side={"bottom"} className="h-full w-full">
          <ScrollArea className="h-full pr-4">
            <div className='px-0.5'>
              <SheetHeader>
                {crewMember.item_type !== "custom" &&
                  <SheetTitle>{`${crewMember.user_profile.first_name} ${crewMember.user_profile.last_name}`}</SheetTitle>
                }
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <img src={crewMember.user_profile.avatar || "/img/placeholder.svg"} alt={`${crewMember.user_profile.first_name} ${crewMember.user_profile.last_name}`} className="w-32 h-32 object-cover rounded-full mx-auto" />
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-4'>
                    <h3 className="text-lg font-semibold">Profile Details</h3>
                    <div className="flex space-x-4">
                      <Input
                        placeholder="First Name"
                        value={tempFirstName}
                        onChange={(e) => setTempFirstName(e.target.value)}
                      />
                      <Input
                        placeholder="Last Name"
                        value={tempLastName}
                        onChange={(e) => setTempLastName(e.target.value)}
                      />
                    </div>
                    <div className='flex w-full space-x-4'>
                      <div className='w-full'>
                        <p className="mb-2"><strong>Department:</strong></p>
                        <Select value={tempDepartment} onValueChange={setTempDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentPositions.map(dep => (
                              <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='w-full'>
                        <p className="mb-2"><strong>Position:</strong></p>
                        <Select value={tempPosition} onValueChange={setTempPosition}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentPositions
                              .find(dep => dep.name === tempDepartment)
                              ?.positions.map(pos => (
                                <SelectItem key={pos.id} value={pos.name}>{pos.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2"><strong>Status:</strong></p>
                      <Select
                        value={tempStatus}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre_selected">Pre-selected</SelectItem>
                          <SelectItem value="requested">Requested</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="mb-2"><strong>Episodes:</strong></p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Select
                          value={selectedEpisode?.id || ''}
                          onValueChange={(value) => setSelectedEpisode(selectableEpisodes.find(ep => ep.id === value) || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select episode" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectableEpisodes.map((episode) => (
                              <SelectItem key={episode.id} value={episode.id}>{episode.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddEpisode} disabled={!selectedEpisode}>
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tempEpisodes.map((episode) => (
                          <div key={episode.id} className="flex items-center justify-between bg-secondary p-2 rounded">
                            <span>{episode.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveEpisode(episode)}
                              disabled={tempEpisodes.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2"><strong>Fee:</strong></p>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={tempFee}
                          onChange={(e) => setTempFee(Number(e.target.value))}
                          className="w-32"
                        />
                        <span>$/project</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {tempStatus === 'booked' && renderBookingSection()}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Crew Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {renderBookingSection()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}