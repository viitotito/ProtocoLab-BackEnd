import jwt from "jsonwebtoken";

/**
 * Gera um Access Token JWT para autenticação do usuário.
 *
 * Contém dados básicos de autorização e identidade do usuário,
 * como id, empresa e role. Possui tempo de expiração curto.
 *
 * @function generateAccessToken
 * @param {Object} user - Usuário autenticado.
 * @param {string} user.id - ID do usuário.
 * @param {string} user.companyId - ID da empresa.
 * @param {string} user.role - Papel do usuário (ex: Admin, User).
 * @param {string} user.name - Nome do usuário.
 *
 * @returns {string} Token JWT de acesso.
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      companyId: user.companyId,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  );
}

/**
 * Gera um Refresh Token JWT para renovação da sessão.
 *
 * Contém apenas o identificador do usuário (sub),
 * com objetivo de segurança e menor exposição de dados.
 *
 * @function generateRefreshToken
 * @param {Object} user - Usuário autenticado.
 * @param {string} user.id - ID do usuário.
 *
 * @returns {string} Token JWT de refresh.
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  );
}

/**
 * Verifica e decodifica um Access Token JWT.
 *
 * @function verifyAccessToken
 * @param {string} token - Token JWT de acesso.
 *
 * @returns {Object} Payload decodificado do token.
 *
 * @throws {Error} Se o token for inválido ou expirado.
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

/**
 * Verifica e decodifica um Refresh Token JWT.
 *
 * @function verifyRefreshToken
 * @param {string} token - Token JWT de refresh.
 *
 * @returns {Object} Payload decodificado do token.
 *
 * @throws {Error} Se o token for inválido ou expirado.
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}