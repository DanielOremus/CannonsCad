import type { VehicleFlag } from "../enums/vehicle.js"
import type { BaseDTO } from "./base.dto.js"

export type OwnersVehicle = BaseDTO & {
  make: string
  model: string
  year: number
  color: string | null
  licensePlate: string
  flags: VehicleFlag[]
}
