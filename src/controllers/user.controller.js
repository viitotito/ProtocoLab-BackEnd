import * as userService from "../services/user.service.js";

export async function listUsers(req, res) {
  const users = await userService.listUsers(req.user.companyId);
  return res.json(users);
}

export async function getUser(req, res) {
  const user = await userService.getUserById(
    Number(req.params.id),
    req.user.companyId
  );

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  return res.json(user);
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUser(
      req.user.companyId,
      req.body
    );

    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
      Number(req.params.id),
      req.user.companyId,
      req.body
    );

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export async function deleteUser(req, res) {
  try {
    await userService.deleteUser(
      Number(req.params.id),
      req.user.companyId
    );

    return res.json({
      message: "Usuário deletado com sucesso.",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}