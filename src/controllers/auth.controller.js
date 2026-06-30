import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      message: req.t("auth:success.register_success"),
      user,
    });

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body, res);

    return res.status(200).json({
      message: req.t("auth:success.login_success"),
      ...result,
    });

  } catch (err) {

    return res.status(err.statusCode || 401).json({
      message: req.t(err.message),
    });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    const accessToken = await authService.refresh(token);

    return res.status(200).json({
      message: req.t("auth:success.refresh_success"),
      accessToken,
    });

  } catch (err) {

    return res.status(err.statusCode || 401).json({
      message: req.t(err.message),
    });
  }
}

export async function me(req, res) {
  try {
    const user = await authService.me(req.user.id);

    return res.status(200).json(user);

  } catch (err) {

    return res.status(err.statusCode || 404).json({
      message: req.t(err.message),
    });
  }
}

export async function logout(req, res) {
  try {
    const result = await authService.logout(res);

    return res.status(200).json({
      message: req.t("auth:success.logout_success"),
    });

  } catch (err) {
    
    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}