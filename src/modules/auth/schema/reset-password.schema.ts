import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
