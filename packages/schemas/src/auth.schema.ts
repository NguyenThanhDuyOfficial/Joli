import z, { transform } from "zod";

const EmailSchema = z
  .email("EMAIL_INVALID")
  .min(1, "EMAIL_MIN")
  .max(100, "EMAIL_MAX");
const PasswordSchema = z
  .string()
  .min(8, "PASSWORD_MIN")
  .max(100, "PASSWORD_MAX");

export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  rememberMe: z.string().transform((value) => value === "on"),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(1, "NAME_MIN").max(50, "NAME_MAX"),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "CONFIRM_PASSWORD_MIN"),
    acceptTerm: z.boolean().refine((val) => val === true, {
      message: "ACCEPT_TERM",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "CONFIRM_PASSWORD_INVALID",
    path: ["confirmPassword"],
  });

export type SignInType = z.infer<typeof SignInSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;
