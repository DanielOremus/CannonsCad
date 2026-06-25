import type { VehicleFlag } from "@project/shared"
import type { BaseEntity } from "./base.entity.js"

export type VehicleEntity = Readonly<
  BaseEntity & {
    make: string
    model: string
    year: number
    color: string | null
    licensePlate: string
    flags: VehicleFlag[]
  }
>
