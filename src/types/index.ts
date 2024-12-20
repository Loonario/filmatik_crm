export type UserRole = "admin" | "customer"
export type ProjectStatus = "active" | "inactice" | "archived"
export type UserRoleInProduction = "admin" | "user"
export type StatusItemInProject = "pre_selected" | "requested" | "booked"
export type StatusRequest = "accepted" | "declined" | "pending"
export type StatusContract = "done" | "pending" | "accepted" | "declined" | "in_progress"
export type SidebarGlobalMenu = "dashboard" | "team" | "chats"
export type Category = "crew" | "locations" | "vehicles" | "props" | "costumes" | "equipment" | "transportation" | "cast" | "special_vehicles" | "sfx" | "stunts" | "post_production" | "other"
export type SidebarProjectMenuItems = "budget" | "calendar"
export type SidebarProjectMenu = (Category | SidebarProjectMenuItems)
export type ItemType = "custom" | "marketplace"