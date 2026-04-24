import { z } from "zod";
import { ObjectId } from "mongodb";

function validateObjectId(id) {
  return ObjectId.isValid(id);
}

const authorCreateSchema = z
  .object({
    name: z
      .string({ message: "Nome é obrigatório" })
      .trim()
      .min(1, "Nome é obrigatório"),
    nationality: z.string().optional(),
  })
  .strict();

const authorUpdateSchema = z
  .object({
    name: z
      .string({ message: "Nome é obrigatório" })
      .trim()
      .min(1, "Nome é obrigatório")
      .optional(),
    nationality: z.string().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo é obrigatório",
  });

export { authorCreateSchema, authorUpdateSchema, validateObjectId };
