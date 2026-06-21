import { ValidationError } from "../errors/app.error.js"

export function parseId(raw: string) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError([], "Invalid id format")
  }
  return id
}
