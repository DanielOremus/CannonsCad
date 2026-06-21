import type { LicenseCategory } from "@project/shared"
import type { BaseEntity } from "./base.entity.js"

export type DriverLicenseEntity = BaseEntity & {
  categories: LicenseCategory[]
}
