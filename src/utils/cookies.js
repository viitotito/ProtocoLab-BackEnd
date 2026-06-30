/**
 * Define o cookie de refresh token no navegador do usuário.
 *
 * O cookie é configurado como HTTP-only para evitar acesso via JavaScript
 * e segue boas práticas de segurança para autenticação JWT.
 *
 * @function setRefreshCookie
 * @param {Response} res - Response do Express.
 * @param {string} token - Refresh token JWT.
 *
 * @returns {void}
 */
export function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * Remove o cookie de refresh token do navegador.
 *
 * Usado no logout para invalidar a sessão do usuário no cliente.
 *
 * @function clearRefreshCookie
 * @param {Response} res - Response do Express.
 *
 * @returns {void}
 */
export function clearRefreshCookie(res) {
  res.clearCookie("refreshToken");
}