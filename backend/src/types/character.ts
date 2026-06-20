import { type CharacterCreateDTO } from "@project/shared"

const CHARACTER_INCLUDE = {
  driverLicense: true,
  user: true,
  vehicles: true,
} satisfies Prisma.CharacterInclude

export type RawCharacter = Prisma.Result<
  typeof prisma.character,
  { include: typeof CHARACTER_INCLUDE },
  "findFirst"
>

export type CharacterCreateInput = CharacterCreateDTO & { userId: number }
