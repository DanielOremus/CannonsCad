import { ValidationError } from "../errors/app.error.js"
import z from "zod/v4"

const uuidSchema = z.uuidv4()

export function parseId(raw: string) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError([], "Invalid id format")
  }
  return id
}
export function parseUuid(raw: string) {
  const result = uuidSchema.safeParse(raw)
  if (!result.success) throw new ValidationError([], "Invalid id format")
  return result.data
}
