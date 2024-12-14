import {Department, Position, Project} from "./api"
import {UserRoleInProduction, Category} from "@/types"

export interface Production {
    id: string;
    created_by_customer: string;
    name: string;
    about: string;
    date_established: Date;
    logo: string;
    showreel: string,
    updated_at: string;
    created_at: string;
  }

  export interface ProductionCustomer {
    production_id: string;
    customer_id: string;
    department: Department;
    position: Position; //Position in Production
    role_in_production: UserRoleInProduction;
    updated_at: string;
    created_at: string;
  }

  export interface ProductionProjectCustomer {
    production_id: string;
    customer_id: string;
    project_id: string;
    project: Project,
    department: Department;
    position: Position; //Position in the Project if diff from Production position
    access_to_categories: Category[];
    updated_at: string;
    created_at: string;
  }

//   export interface CustomerProjectForAll {
//     project: Project,
//     department: Department;
//     position: Position; //Position in the Project if diff from Production position
//     access_to_categories: Category[] | "all";
// }


export interface CustomerProjectsAll {
    customer_id: string;
    my_projects: {projects: Project[] | [],
                access_to_categories: Category[]} | null; //projects with project_id === null and access to categories for current customer account
    productions: {
        production: Production | null ;
        projects: {
            project: Project,
                department: Department;
                position: Position; //Position in the Project if diff from Production position
                access_to_categories: Category[];
                    }[] | null
        // projects: CustomerProjectForAll[] | null;
        department: Department;
        position: Position; //Position in Production
        role_in_production: UserRoleInProduction;
}[] | null
}