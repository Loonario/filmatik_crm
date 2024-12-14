"use server"

import {StatusContract, ItemType, Category} from "@/types"

export interface ProjectContract {
  id: string;
  project_id: string;
  contract_id: string;
  item_type: ItemType;
  category: Category;
  updated_at: string;
  created_at: string;
}

export interface ContractProjectPro {
  id: string;
  customer_id: string | null;
  pro_id: string;
  position_id: string;
  department_id: string;
  production_id: string | null;
  project_id: string;
  contract_status: StatusContract;
  base_fee: number | null;
  extra_total: number | null;
  total_cost: number;
  payment_id: string | null;
  payed_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface ContractDateRange {
  id: string;
  contract_id: string;
  date_from: string;
  date_to: string;
  comment: string | null;
  updated_at: string;
  created_at: string;
}

export interface ContractExtraCost {
  id: string;
  contract_id: string;
  date_from: string | null;
  date_to: string | null;
  comment: string | null;
  fee: number;
  episode_id: string;
  updated_at: string;
  created_at: string;
}

export interface ContractPro {
  contract: ContractProjectPro;
  dates: ContractDateRange[];
  extra_costs: ContractExtraCost[];

}