import { z } from "zod";

export const verifyOTPSchema = z.object({
  code: z.string().min(6, { message: "Code must be 6 digits long" }),
});

export type VerifyOTPSchemaType = z.infer<typeof verifyOTPSchema>;
