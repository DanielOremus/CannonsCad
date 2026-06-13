import bcrypt from "bcrypt"

export async function hashPassword(password: string, rounds: number = 10) {
  return await bcrypt.hash(password, rounds)
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}
