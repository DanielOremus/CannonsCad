export const UserRole = {
  POLICE: "POLICE",
  DISPATCH: "DISPATCH",
  CIVILIAN: "CIVILIAN",
  EMS: "EMS",
  ADMIN: "ADMIN",
  REGISTERED: "REGISTERED",
} as const

export const UserRolePriority: Record<UserRole, number> = {
  REGISTERED: 0,
  CIVILIAN: 1,
  POLICE: 2,
  EMS: 2,
  DISPATCH: 3,
  ADMIN: 4,
}

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
