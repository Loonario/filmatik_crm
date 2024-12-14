"use server"

import { v4 as uuidv4 } from 'uuid';
import {UserRole, ProjectStatus,
  StatusItemInProject,
  ItemType,
  Category,
  StatusContract,
  UserRoleInProduction} from "@/types"
import {ContractProjectPro,
  ContractDateRange,
  ContractExtraCost,
  ContractPro} from "./api-contracts"
import {Production,
  ProductionCustomer,
  ProductionProjectCustomer,
  // CustomerProjectForAll,
  CustomerProjectsAll} from "./api-productions"
  


export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isPro: boolean;
  isVehicleOwner: boolean;
  isLandlord: boolean;
  located_at: string;
  updated_at: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user_profile_id: string;
  in_industry_since: string;
  department: string;
  position: string;
  access_to_categories: Category[];
  updated_at: string;
  created_at: string;
}

export interface Seller {
  id: string;
  user_profile_id: string;
  isPro: boolean;
  isVehicleOwner: boolean;
  isLandlord: boolean;
  located_at: string;
  updated_at: string;
  created_at: string;
}

export interface Pro {
  id: string;
  user_profile_id: string;
  skills_description: string,
  experience_description: string;
  in_industry_since: string,
  showreel: string,
  fee: number;
  updated_at: string;
  created_at: string;
}

export interface Project {
  id: string;
  customer_id: string;
  production_id: string | null;
  name: string;
  description: string;
  cover_img: string;
  date_start: string;
  date_end: string;
  genre: string;
  status: ProjectStatus;
  updated_at: string;
  created_at: string;
}

export interface Episode {
  id: string;
  project_id: string;
  name: string;
  isAll: boolean;
  updated_at: string;
  created_at: string;
}

export interface ProjectItem {
  id: string;
  project_id: string;
  item_id: string;
  item_type: ItemType;
  category: Category;
  status: StatusItemInProject;
  updated_at: string;
  created_at: string;
}

export interface ProjectEpisodePro {
  id: string;
  project_id: string;
  episode_id: string;
  pro_id: string;
  updated_at: string;
  created_at: string;
}

// export interface EpisodePro extends Episode {
// }

export interface ProData {
user_profile: UserProfile;
pro: Pro;
episodes: Episode[];
department: Department;
position: Position;
project_id: string;
status: StatusItemInProject;
item_type: ItemType;
contract: ContractPro | null;
}

export interface Position {
  id: string;
  department_id: string;
  name: string;
  updated_at: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
}

export interface DepartmentPositions extends Department {
positions: Position[];
}

export interface ProDepPosition {
  id: string;
  pro_id: string;
  department_id: string;
  position_id: string;
  updated_at: string;
  created_at: string;
}


// Mock data


const mockUserProfile: UserProfile[] = [
  {
    id: uuidv4(),
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    avatar: '/img/customer_ava.jpg',
    role: 'customer' as UserRole,
    isPro: false,
    isVehicleOwner: false,
    isLandlord: false,
    located_at: 'New York, USA',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    first_name: 'Antony',
    last_name: 'Kiddis',
    email: 'antony.kiddis@example.com', // Fixed duplicate email
    avatar: '/img/editor_ava.jpg',
    role: 'seller' as UserRole,
    isPro: true,
    isVehicleOwner: false,
    isLandlord: false,
    located_at: 'New York, USA',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    first_name: 'Mary',
    last_name: 'Whatson',
    email: 'mary.whatson@example.com', // Fixed duplicate email
    avatar: '/img/editor_ava.jpg',
    role: 'seller' as UserRole,
    isPro: true,
    isVehicleOwner: false,
    isLandlord: false,
    located_at: 'LA, USA',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    first_name: 'Will',
    last_name: 'Smith',
    email: 'willy@example.com', // Fixed duplicate email
    avatar: '/img/editor_ava.jpg',
    role: 'seller' as UserRole,
    isPro: true,
    isVehicleOwner: false,
    isLandlord: false,
    located_at: 'LA, USA',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  ];

const mockCustomer: Customer = {
  id: uuidv4(),
  user_profile_id: mockUserProfile[0].id,
  in_industry_since: '2010-01-01',
  department: 'Production',
  position: 'Producer',
  access_to_categories: ["crew",  "locations",  "vehicles",  "props",  "costumes",  "equipment",  "transportation",  "cast",  "special_vehicles", "sfx", "stunts", "post_production", "other"],
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

const mockPros: Pro[] = [
  {
  id: uuidv4(),
  user_profile_id: mockUserProfile[1].id,
  skills_description: "location scout",
  experience_description: "worked on many feature films",
  in_industry_since: '2010-01-01',
  showreel: "/video.mp4",
  fee: 100,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
},
{
  id: uuidv4(),
  user_profile_id: mockUserProfile[2].id,
  skills_description: "location scout",
  experience_description: "worked on many feature films",
  in_industry_since: '2010-01-01',
  showreel: "/video.mp4",
  fee: 50,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
},
{
  id: uuidv4(),
  user_profile_id: mockUserProfile[3].id,
  skills_description: "location scout",
  experience_description: "worked on many feature films",
  in_industry_since: '2010-01-01',
  showreel: "/video.mp4",
  fee: 75,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
},
{
  id: uuidv4(),
  user_profile_id: mockUserProfile[1].id,
  skills_description: "actor sometimes",
  experience_description: "worked on many feature films",
  in_industry_since: '2010-01-01',
  showreel: "/video.mp4",
  fee: 50,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
},
];

// Mock Production data
const mockProductions: Production[] = [
  {
    id: uuidv4(),
    created_by_customer: mockCustomer.id,
    name: 'Sci-Fi Production',
    about: 'A high-budget science fiction production',
    date_established: new Date('2022-01-01'),
    logo: '/img/production-logo.png',
    showreel: '/video/production-reel.mp4',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    created_by_customer: mockCustomer.id,
    name: 'Romantic Comedy Production',
    about: 'A heartwarming romantic comedy production',
    date_established: new Date('2023-02-15'),
    logo: '/img/production-logo-2.png',
    showreel: '/video/production-reel-2.mp4',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const mockProjects: Project[] = [
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    production_id: mockProductions[0].id,
    name: 'Sci-Fi Epic',
    description: 'A grand space opera spanning galaxies',
    cover_img: '/img/placeholder.svg',
    date_start: '2023-01-01',
    date_end: '2023-12-31',
    genre: 'Science Fiction',
    status: 'active' as ProjectStatus,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    production_id: mockProductions[1].id,
    name: 'Romantic Comedy',
    description: 'A heartwarming tale of love and laughter',
    cover_img: '/img/placeholder.svg',
    date_start: '2023-03-01',
    date_end: '2023-09-30',
    genre: 'Romance',
    status: 'active'as ProjectStatus,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    production_id: null,
    name: 'My Mega Project',
    description: 'A grand space opera spanning galaxies',
    cover_img: '/img/placeholder.svg',
    date_start: '2023-01-01',
    date_end: '2023-12-31',
    genre: 'Science Fiction',
    status: 'active' as ProjectStatus,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    production_id: mockProductions[0].id,
    name: 'Toy Story',
    description: 'Toys advenrures',
    cover_img: '/img/placeholder.svg',
    date_start: '2023-01-01',
    date_end: '2023-12-31',
    genre: 'Animation',
    status: 'active',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const mockEpisodes: Episode[] = [
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    name: 'All Episodes',
    isAll: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    name: 'Episode 1',
    isAll: false,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    name: 'Episode 2',
    isAll: false,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[1].id,  // For second project
    name: 'All Episodes',
    isAll: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id, 
    name: 'Pilot',
    isAll: false,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[2].id,  // For second project
    name: 'All Episodes',
    isAll: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[3].id,
    name: 'All Episodes',
    isAll: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const mockProjectItems: ProjectItem[] = [
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    item_id: mockPros[0].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'booked' as StatusItemInProject, // Changed to booked
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    item_id: mockPros[1].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'requested' as StatusItemInProject,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    item_id: mockPros[2].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'booked' as StatusItemInProject,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[1].id,
    item_id: mockPros[0].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'booked' as StatusItemInProject,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[1].id,
    item_id: mockPros[1].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'booked' as StatusItemInProject,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[3].id,
    item_id: mockPros[1].id,
    item_type: "custom" as ItemType,
    category: "crew" as Category,
    status: 'requested' as StatusItemInProject,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

const mockProjectEpisodesPros: ProjectEpisodePro[] = [
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    episode_id: mockEpisodes[0].id,
    pro_id: mockPros[0].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    episode_id: mockEpisodes[1].id,
    pro_id: mockPros[1].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    episode_id: mockEpisodes[2].id,
    pro_id: mockPros[2].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[0].id,
    episode_id: mockEpisodes[4].id,
    pro_id: mockPros[3].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[1].id,
    episode_id: mockEpisodes[0].id,
    pro_id: mockPros[2].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[1].id,
    episode_id: mockEpisodes[0].id,
    pro_id: mockPros[1].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    project_id: mockProjects[3].id,
    episode_id: mockEpisodes[6].id,
    pro_id: mockPros[1].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

const mockDepartments: Department[] = [
  {
    id: uuidv4(),
    name: "Production",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Director's",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Cameras and Lighting",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Sound Production",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Art",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Hair and Make-up",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Costume",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Stunts",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "SFX",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Post-production",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  
];

const mockPositions: Position[] = [
  {
    id: uuidv4(),
    department_id: mockDepartments[9].id,
    name: "Sound Designer",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[9].id,
    name: "Rotoscope Artist",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[0].id,
    name: "Production Manager",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[0].id,
    name: "Line Producer",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[2].id,
    name: "Gaffer",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[2].id,
    name: "Digital Imaging Technician",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    department_id: mockDepartments[2].id,
    name: "DoP",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const mockProDepPositions: ProDepPosition[] = [
  {
    id: uuidv4(),
    pro_id: mockPros[0].id,
    department_id: mockDepartments[0].id, // production
    position_id: mockPositions[2].id,     // production manager
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    pro_id: mockPros[1].id,
    department_id: mockDepartments[2].id, // camera and lighting
    position_id: mockPositions[6].id,     // DoP
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    pro_id: mockPros[3].id,
    department_id: mockDepartments[9].id, // post-production
    position_id: mockPositions[1].id,     // rotoscoping artist
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    pro_id: mockPros[2].id,
    department_id: mockDepartments[0].id, // production
    position_id: mockPositions[3].id,     // line producer
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Mock Contract Data
const mockContracts: ContractProjectPro[] = [
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    pro_id: mockPros[0].id,
    position_id: mockPositions[2].id,
    department_id: mockDepartments[0].id,
    production_id: mockProjects[0].production_id,
    project_id: mockProjects[0].id,
    contract_status: 'accepted' as StatusContract,
    base_fee: 500,
    extra_total: 100,
    total_cost: 600,
    payment_id: uuidv4(),
    payed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    pro_id: mockPros[2].id,
    position_id: mockPositions[3].id,
    department_id: mockDepartments[0].id,
    production_id: mockProjects[0].production_id,
    project_id: mockProjects[0].id,
    contract_status: 'accepted' as StatusContract,
    base_fee: 600,
    extra_total: 150,
    total_cost: 750,
    payment_id: uuidv4(),
    payed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    pro_id: mockPros[0].id,
    position_id: mockPositions[2].id,
    department_id: mockDepartments[0].id,
    production_id: mockProjects[1].production_id,
    project_id: mockProjects[1].id,
    contract_status: 'accepted' as StatusContract,
    base_fee: 800,
    extra_total: 200,
    total_cost: 1000,
    payment_id: uuidv4(),
    payed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_id: mockCustomer.id,
    pro_id: mockPros[1].id,
    position_id: mockPositions[6].id,
    department_id: mockDepartments[2].id,
    production_id: mockProjects[1].production_id,
    project_id: mockProjects[1].id,
    contract_status: 'pending' as StatusContract,
    base_fee: 700,
    extra_total: 0,
    total_cost: 700,
    payment_id: null,
    payed_at: null,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

const mockContractDateRanges: ContractDateRange[] = [
  {
    id: uuidv4(),
    contract_id: mockContracts[0].id,
    date_from: '2024-01-15',
    date_to: '2024-02-15',
    comment: 'Principal photography period',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[1].id,
    date_from: '2024-01-20',
    date_to: '2024-02-20',
    comment: 'Main production period',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[2].id,
    date_from: '2024-03-01',
    date_to: '2024-04-15',
    comment: 'Second project shooting period',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[3].id,
    date_from: '2024-03-01',
    date_to: '2024-03-30',
    comment: 'First shooting block',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[3].id,
    date_from: '2024-04-10',
    date_to: '2024-04-30',
    comment: 'Second shooting block',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

const mockContractExtraCosts: ContractExtraCost[] = [
  {
    id: uuidv4(),
    contract_id: mockContracts[0].id,
    date_from: '2024-01-28',
    date_to: '2024-01-30',
    comment: 'Weekend overtime',
    fee: 100,
    episode_id: mockEpisodes[1].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[1].id,
    date_from: '2024-02-15',
    date_to: '2024-02-17',
    comment: 'Night shooting bonus',
    fee: 150,
    episode_id: mockEpisodes[2].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    contract_id: mockContracts[2].id,
    date_from: '2024-03-25',
    date_to: '2024-03-27',
    comment: 'Location shooting bonus',
    fee: 200,
    episode_id: mockEpisodes[4].id,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];


// Mock ProductionCustomer data
const mockProductionCustomers: ProductionCustomer[] = [
  {
    production_id: mockProductions[0].id,
    customer_id: mockCustomer.id,
    department: mockDepartments[0],
    position: mockPositions[2],
    role_in_production: 'admin' as UserRoleInProduction,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    production_id: mockProductions[1].id,
    customer_id: mockCustomer.id,
    department: mockDepartments[0],
    position: mockPositions[3],
    role_in_production: 'user' as UserRoleInProduction,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Mock ProductionProjectCustomer data
const mockProductionProjectCustomers: ProductionProjectCustomer[] = [
  {
    production_id: mockProductions[0].id,
    customer_id: mockCustomer.id,
    project_id: mockProjects[0].id,
    project: mockProjects[0],
    department: mockDepartments[0],
    position: mockPositions[2],
    access_to_categories: ['crew', 'locations', 'vehicles', 'props', 'costumes', 'equipment', 'transportation', 'rental', 'special_vehicles', "sfx", "stunts", "post_production", "other"] as Category[],
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    production_id: mockProductions[1].id,
    customer_id: mockCustomer.id,
    project_id: mockProjects[1].id,
    project: mockProjects[1],
    department: mockDepartments[0],
    position: mockPositions[3],
    access_to_categories: ['crew', 'vehicles', 'cast'],
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    production_id: mockProductions[0].id,
    customer_id: mockCustomer.id,
    project_id: mockProjects[3].id,
    project: mockProjects[3],
    department: mockDepartments[0],
    position: mockPositions[3],
    access_to_categories: ['crew', 'vehicles', 'cast'],
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// Mock API functions
export async function getCurrentUserProfile(): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUserProfile[0]), 200);
  });
}

export async function getUserProfile(userProfileId: string): Promise<UserProfile | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userProf = mockUserProfile.find(user => user.id === userProfileId);
      resolve(userProf || null);
    }, 200);
  });
}

export async function getUsersProfiles(usersIds: string[]): Promise<UserProfile[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const usersProfiles = mockUserProfile.filter(user => usersIds.includes(user.id));
      resolve(usersProfiles);
    }, 200);
  });
}

export async function getCustomerData(userProfileId: string): Promise<Customer | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userProfileId === mockCustomer.user_profile_id) {
        resolve(mockCustomer);
      } else {
        resolve(null);
      }
    }, 200);
  });
}

export async function getProjects(customerId: string): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customerProjects = mockProjects.filter(project => project.customer_id === customerId);
      resolve(customerProjects);
    }, 200);
  });
}


export async function getEpisodes(projectId: string): Promise<Episode[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectEpisodes = mockEpisodes.filter(episode => episode.project_id === projectId);
      resolve(projectEpisodes);
    }, 200);
  });
}

export async function getProjectItems(projectId: string): Promise<ProjectItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prosForProject = mockProjectItems.filter(project => project.project_id === projectId);
      resolve(prosForProject);
    }, 200);
  });
}

export async function getProjectEpisodePros(projectId: string): Promise<ProjectEpisodePro[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prosForEpisode = mockProjectEpisodesPros.filter(project => project.project_id === projectId);
      resolve(prosForEpisode);
    }, 200);
  });
}

export async function getPros(proIds: string[]): Promise<Pro[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pros = mockPros.filter(pro => proIds.includes(pro.id));
      resolve(pros);
    }, 200);
  });
}

export async function getAllDepartments(): Promise<Department[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDepartments);
    }, 200);
  });
}

// Get all positions at once
export async function getAllPositions(): Promise<Position[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPositions);
    }, 200);
  });
}

// Get departments with their positions
export async function getAllDepartmentPositions(): Promise<DepartmentPositions[]> {
  return new Promise(async (resolve) => {
    try {
      // Get all data in parallel
      const [departments, allPositions] = await Promise.all([
        getAllDepartments(),
        getAllPositions()
      ]);

      // Create a map of positions by department ID for faster lookup
      const positionsByDepartment = allPositions.reduce((acc, position) => {
        if (!acc[position.department_id]) {
          acc[position.department_id] = [];
        }
        acc[position.department_id].push(position);
        return acc;
      }, {} as Record<string, Position[]>);

      // Assemble the final data structure
      const departmentPositions = departments.map(department => ({
        ...department,
        positions: positionsByDepartment[department.id] || []
      }));

      resolve(departmentPositions);
    } catch (error) {
      console.error('Error in getAllDepartmentPositions:', error);
      resolve([]);
    }
  });
}

export async function getPositionsByDepartmentId(departmentId: string): Promise<Position[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departmentPositions = mockPositions.filter(position => position.department_id === departmentId);
      resolve(departmentPositions);
    }, 200);
  });
}

export async function getProDepPosition(proId: string): Promise<ProDepPosition | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const proDepPosition = mockProDepPositions.find(pdp => pdp.pro_id === proId);
      resolve(proDepPosition || null);
    }, 200);
  });
}

export async function getDepartmentById(departmentId: string): Promise<Department | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const department = mockDepartments.find(dep => dep.id === departmentId);
      resolve(department || null);
    }, 200);
  });
}

export async function getPositionById(positionId: string): Promise<Position | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const position = mockPositions.find(pos => pos.id === positionId);
      resolve(position || null);
    }, 200);
  });
}

//Get CREW

export async function getCrew(projectId: string): Promise<ProData[]> {
  return new Promise(async (resolve) => {
    try {
      // Get all required data in parallel to improve performance
      const [
        episodes,
        prosForProject,
        prosForEpisode,
        projectContracts
      ] = await Promise.all([
        getEpisodes(projectId),
        getProjectItems(projectId),
        getProjectEpisodePros(projectId),
        getContractsProject(projectId)
      ]);
      
      if (!episodes.length) {
        resolve([]);
        return;
      }

      if (!prosForEpisode.length) {
        resolve([]);
        return;
      }

      const uniqueProIds = [...new Set(prosForEpisode.map(pro => pro.pro_id))];
      const pros = await getPros(uniqueProIds);
      
      if (!pros.length) {
        resolve([]);
        return;
      }

      const uniqueUserProfileIds = [...new Set(pros.map(pro => pro.user_profile_id))];
      const usersProfiles = await getUsersProfiles(uniqueUserProfileIds);

      const proDataPromises = pros.map(async (pro) => {
        const userProfile = usersProfiles.find(user => user.id === pro.user_profile_id);
        const proEpisodes = prosForEpisode
          .filter(pep => pep.pro_id === pro.id)
          .map(pep => episodes.find(ep => ep.id === pep.episode_id))
          .filter((ep): ep is Episode => ep !== undefined);
        
        const statusInProj = prosForProject.find(pfp => pfp.item_id === pro.id);
        const proDepPosition = await getProDepPosition(pro.id);
        
        if (!userProfile || !statusInProj || !proDepPosition) {
          return null;
        }

        const department = await getDepartmentById(proDepPosition.department_id);
        const position = await getPositionById(proDepPosition.position_id);

        if (!department || !position) {
          return null;
        }

        // Find contract for this pro in this project
        const proContract = projectContracts.find(
          contractData => contractData.contract.pro_id === pro.id
        );

        return {
          user_profile: userProfile,
          pro: pro,
          episodes: proEpisodes,
          department: department,
          position: position,
          project_id: projectId,
          status: statusInProj.status,
          item_type: statusInProj.item_type,
          contract: proContract || null
        };
      });

      const crew = (await Promise.all(proDataPromises)).filter((item): item is ProData => item !== null);
      resolve(crew);
    } catch (error) {
      console.error('Error in getCrew:', error);
      resolve([]);
    }
  });
}

// Get Contracts by pro ID and project ID
export async function getContractsProject(projectId: string): Promise<ContractPro[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find all contracts for the specific project
      const contracts = mockContracts.filter(
        contract => contract.project_id === projectId
      );
      if (!contracts.length) {
        resolve([]);
        return;
      }
      // Get contract details for each contract
      const contractProData = contracts.map(contract => {
        const dates = mockContractDateRanges.filter(
          dateRange => dateRange.contract_id === contract.id
        );
        const extraCosts = mockContractExtraCosts.filter(
          extraCost => extraCost.contract_id === contract.id
        );
        return {
          contract,
          dates,
          extra_costs: extraCosts
        };
      });

      resolve(contractProData);
    }, 200);
  });
}

//Get Customer Projects

export async function getProduction(productionId: string | null): Promise<Production | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const production = mockProductions.find(p => p.id === productionId);
      resolve(production || null);
    }, 200);
  });
}

// Gett all Productions participateion for the Customer
export async function getProductionsCustomer(customerId: string): Promise<ProductionCustomer[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productionCustomer = mockProductionCustomers.filter(
        pc =>  pc.customer_id === customerId
      );
      resolve(productionCustomer || null);
    }, 200);
  });
}

// Get all ProductionProjectCustomers for pecific Customer
async function getProductionProjectCustomers (
  customerId: string,
): Promise<ProductionProjectCustomer[] | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productionProjectCustomer = mockProductionProjectCustomers.filter(
        ppc => ppc.customer_id === customerId
      );
      resolve(productionProjectCustomer || null);
    }, 200);
  });
}


export async function getCustomerProjectsAll(customerId: string, categories: Category[]): Promise<CustomerProjectsAll> {
  try {
    // Get the customer's projects
    const projects = await getProjects(customerId);
    // Get All productions' partcipation
    const productionsCustomer = await getProductionsCustomer(customerId)
    // Get All projects for current customer in the Production
    const productionProjectCustomer = await getProductionProjectCustomers(customerId)
    

    // Get the customer's productions
    const productions: CustomerProjectsAll['productions'] = productionsCustomer 
    ? await Promise.all(
        productionsCustomer.map(async prod => ({
          production: await getProduction(prod.production_id),
          projects: productionProjectCustomer 
            ? productionProjectCustomer
                .filter(ppc => ppc.production_id === prod.production_id)
                .map(ppc => ({
                  project: ppc.project,
                  department: ppc.department,
                  position: ppc.position,
                  access_to_categories: ppc.access_to_categories,
                }))
            : null,
          department: prod.department,
          position: prod.position,
          role_in_production: prod.role_in_production,
        }))
      )
    : null;
    return {
      customer_id: customerId,
      my_projects: {projects: projects.filter(project => project.production_id === null),
        access_to_categories: categories
      },
      productions,
    };
  } catch (error) {
    console.error('Error in getCustomerProjects:', error);
    return {
      customer_id: customerId,
      my_projects: null,
      productions: null,
    };
  }
}