import type { LicenseCategory } from "../enums/driver.license.js"
import type { BaseDTO } from "./base.dto.js"

export type CharactersDriverLicenseDTO = BaseDTO & {
  categories: LicenseCategory[]
}
