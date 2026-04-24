import { z } from "zod";
import { ObjectId } from "mongodb";

export const bookCreateSchema = z.object({
  title: z
    .string({ message: "Título é obrigatório" })
    .trim()
    .min(1, "Título é obrigatório"),
  publisher: z.string().optional(),
  price: z.number().optional(),
  pages: z.number().optional(),
});

export const bookUpdateSchema = z
  .object({
    title: z
      .string({ message: "Título é obrigatório" })
      .trim()
      .min(1, "Título é obrigatório")
      .optional(),
    publisher: z.string().optional(),
    price: z.number().optional(),
    pages: z.number().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Título é obrigatório",
  });

export function validateObjectId(id) {
  return ObjectId.isValid(id);
}
