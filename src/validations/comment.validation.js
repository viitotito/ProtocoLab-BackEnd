import { z } from "zod";

export const createCommentSchema = z.object({
  description: z.string().min(1, "Comentário não pode ser vazio."),
});

export const updateCommentSchema = z.object({
  description: z.string().min(1, "Comentário não pode ser vazio."),
});