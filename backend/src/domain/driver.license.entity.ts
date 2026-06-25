import type { LicenseCategory } from "@project/shared"
import type { BaseEntity } from "./base.entity.js"

export type DriverLicenseEntity = Readonly<
  BaseEntity & {
    categories: LicenseCategory[]
  }
>
