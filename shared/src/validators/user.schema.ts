import * as z from "zod/v4"

const nameValidator = z.string().trim().min(3)

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().nonempty(),
})

export const registerSchema = z
  .object({
    email: z.email().toLowerCase(),
    name: nameValidator,
    password: z.string().regex(/^\S*$/, "Must not contain spaces").min(4),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "The passwords do not match",
    path: ["confirmPassword"],
  })
  .transform((data) => {
    const { confirmPassword, ...rest } = data
    return rest
  })

export const updateSelfSchema = z.object({
  name: nameValidator,
})

export const updateEmailSchema = z.object({
  email: z.email().toLowerCase,
  password: z.string().trim().nonempty(),
})
export const confirmEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, { error: "Invalid code format" }),
})

export type UserRegisterDTO = z.infer<typeof registerSchema>
export type UserLoginDTO = z.infer<typeof loginSchema>
export type UserUpdateSelfDTO = z.infer<typeof updateSelfSchema>
export type UserUpdateEmailDTO = z.infer<typeof updateEmailSchema>
export type UserConfirmEmailDTO = z.infer<typeof confirmEmailSchema>
