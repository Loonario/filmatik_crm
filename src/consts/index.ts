import {SidebarProjectMenuItems, Category} from "@/types"
import { Users, Car, Truck, Caravan, Video, MapPin, Box, Shirt, UserSquare2, Calendar, DollarSign, Film, Zap, Swords, FilmIcon, MoreHorizontal } from 'lucide-react'

export interface SideBarItems{
name: string;
value: Category;
section: string;
icon: any;
href: string;
}

export const sidebarItems: SideBarItems[] = [
    { name: 'Crew', value: 'crew', section: "categories", icon: Users, href: '/project/crew' },
    { name: 'Vehicles', value: 'vehicles', section: "categories", icon: Car, href: '/project/vehicles' },
    { name: 'Locations', value: 'locations', section: "categories", icon: MapPin, href: '/project/locations' },
    { name: 'Props', value: 'props', section: "categories", icon: Box, href: '/project/props' },
    { name: 'Costumes', value: 'costumes', section: "categories", icon: Shirt, href: '/project/costumes' },
    { name: 'Cast', value: 'cast',section: "categories", icon: UserSquare2, href: '/project/cast' },
    { name: 'Transportation', value: 'transportation', section: "categories", icon: Truck, href: '/project/transportation' },
    { name: 'Equipment', value: 'equipment', section: "categories", icon: Video, href: '/project/equipment' },
    { name: 'Special vehicles', value: 'special_vehicles', section: "categories", icon: Caravan, href: '/project/special-vehicles' },
    { name: 'SFX', value: 'sfx', section: "categories", icon: Zap, href: '/project/sfx' },
    { name: 'Stunts', value: 'stunts', section: "categories", icon: Swords, href: '/project/stunts' },
    { name: 'Post Production', value: 'post_production', section: "categories", icon: FilmIcon, href: '/project/post-production' },
    { name: 'Other', value: 'other', section: "categories", icon: MoreHorizontal, href: '/project/other' },
  ]
  
 export  const bottomItems = [
    { name: 'Calendar', value: 'calendar', section: "bottom", icon: Calendar, href: '/project/calendar' },
    { name: 'Budget', value: 'budget', section: "bottom", icon: DollarSign, href: '/project/budget' },
  ]

  export const sidebarProjectMenuItems: SidebarProjectMenuItems[] = ["budget", "calendar"]

export interface categoryName {
  name: string;
  value: Category;
  color: string;
}

  export const categoriesNames: categoryName[] = [
    {name: 'Crew', value: 'crew', color: '#3498db'},
    {name: 'Vehicles', value: 'vehicles', color: '#f39c12'},
    {name: 'Locations', value: 'locations', color: '#2ecc71'},
    {name: 'Props', value: 'props', color: '#9b59b6'},
    {name: 'Costumes', value: 'costumes', color: '#34675a'},
    {name: 'Cast', value: 'cast', color: '#e74c3c'},
    {name: 'Transportation', value: 'transportation', color: '#d35400'},
    {name: 'Equipment', value: 'equipment', color: '#bd2970'},
    {name: 'Special vehicles', value: 'special_vehicles', color: '#2e44ad'},
    {name: 'SFX', value: 'sfx', color: '#dc32da'},
    {name: 'Stunts', value: 'stunts', color: '#33d2ca'},
    {name: 'Post Production', value: 'post_production', color: '#3464ad'},
    {name: 'Other', value: 'other', color: '#34495c'},
  ]