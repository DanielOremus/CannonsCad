import { CharacterCreateDTO, CharacterFlag, Gender } from "@project/shared"

export const characterCreateData: CharacterCreateDTO = {
  firstName: "Kevin",
  lastName: "Makkevin",
  dob: new Date("1990-01-01"),
  gender: Gender.MALE,
  hasGunPermit: false,
  flags: [CharacterFlag.MENTAL_HEALTH],
  idNumber: "55CA6",
}
