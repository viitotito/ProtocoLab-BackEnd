import * as commentService from "../services/comment.service.js";

export async function createComment(req, res) {
  try {
    const comment = await commentService.createComment(
      Number(req.params.id),
      req.user.id,
      req.user.companyId,
      req.body,
      req.t
    );

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function listComments(req, res) {
  try {
    const comments = await commentService.listComments(
      Number(req.params.id),
      req.user.companyId,
      req.t
    );

    return res.json(comments);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function updateComment(req, res) {
  try {
    const comment = await commentService.updateComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.user.companyId,
      req.user.id,
      req.body,
      req.t
    );

    return res.json(comment);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function deleteComment(req, res) {
  try {
    const result = await commentService.deleteComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.user.companyId,
      req.user.id,
      req.t
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}