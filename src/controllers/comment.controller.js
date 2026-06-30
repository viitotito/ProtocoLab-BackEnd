import * as commentService from "../services/comment.service.js";

export async function createComment(req, res) {
  try {
    const comment = await commentService.createComment(
      Number(req.params.id),
      req.user.id,
      req.user.companyId,
      req.body
    );

    return res.status(201).json(comment);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function listComments(req, res) {
  try {
    const comments = await commentService.listComments(
      Number(req.params.id),
      req.user.companyId
    );

    return res.status(200).json(comments);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
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
      req.body
    );

    return res.status(200).json(comment);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function deleteComment(req, res) {
  try {
    const result = await commentService.deleteComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.user.companyId,
      req.user.id
    );

    return res.status(200).json({
      message: req.t(result.message),
    });

  } catch (err) {
    
    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}