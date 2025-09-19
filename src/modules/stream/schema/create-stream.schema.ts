import { z } from "zod";

export const CreateStreamSchema = z.object({
  name: z.string().nonempty("Stream name is required"),
  category: z.string().nonempty("Category is required"),
  schedule: z.string().nonempty("Schedule is required"),
});

export type CreateStreamSchemaType = z.infer<typeof CreateStreamSchema>;
