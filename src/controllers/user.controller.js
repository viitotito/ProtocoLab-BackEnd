import * as userService from "../services/user.service.js";

export async function listUsers(req, res) {
  const users = await userService.listUsers(req.user.companyId);
  return res.json(users);
}

export async function getUser(req, res) {
  try {
    const user = await userService.getUserById(
      Number(req.params.id),
      req.user.companyId,
      req.t
    );

    return res.json(user);
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUser(
      req.user.companyId,
      req.body,
      req.t
    );

    return res.status(201).json({
      message: req.t("user:success.user_created"),
      user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(
      Number(req.params.id),
      req.user.companyId,
      req.user.id,
      req.body,
      req.t
    );

    return res.json({
      message: req.t("user:success.user_updated"),
      user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    await userService.deleteUser(
      Number(req.params.id),
      req.user.companyId,
      req.user.id,
      req.t
    );

    return res.json({
      message: req.t("user:success.user_deleted"),
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}