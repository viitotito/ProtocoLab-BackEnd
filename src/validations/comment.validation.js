import { z } from "zod";

export const createCommentSchema = (t) =>
  z.object({
    description: z.string({
      required_error: t("validation:comment.description.required"),
    }).min(1, t("validation:comment.description.min")),
  });

export const updateCommentSchema = (t) =>
  z.object({
    description: z.string({
      required_error: t("validation:comment.description.required"),
    }).min(1, t("validation:comment.description.min")),
  });