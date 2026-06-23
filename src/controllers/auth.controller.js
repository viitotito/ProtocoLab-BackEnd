import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body, res);

    return res.json(result);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    const accessToken = await authService.refresh(token);

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

export async function me(req, res) {
  try {
    const user = await authService.me(req.user.id);

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function logout(req, res) {
  try {
    const result = await authService.logout(res);

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}