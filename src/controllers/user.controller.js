import * as userService from "../services/user.service.js";

export async function listUsers(req, res) {
  try {
    const users = await userService.listUsers(req.user.companyId);

    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}