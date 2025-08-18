import { z } from "zod";

export const SignupSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
