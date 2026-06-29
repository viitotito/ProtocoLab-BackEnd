import express from "express";

import * as commentController from "../controllers/comment.controller.js";
import { validate } from "../middlewares/validation.middleware.js";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../validations/comment.validation.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validate(createCommentSchema),
  commentController.createComment
);

router.get(
  "/",
  commentController.listComments
);

router.patch(
  "/:commentId",
  validate(updateCommentSchema),
  commentController.updateComment
);

router.delete(
  "/:commentId",
  commentController.deleteComment
);

export default router;