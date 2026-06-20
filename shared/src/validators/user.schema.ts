import * as z from "zod/v4"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().nonempty(),
})

export const registerSchema = z
  .object({
    email: z.email(),
    name: z.string().trim().min(3),
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

export type UserRegisterDTO = z.infer<typeof registerSchema>
export type UserLoginDTO = z.infer<typeof loginSchema>
