import express from 'express';

import * as authController from '../controllers/auth.controller.js';

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import { registerSchema, loginSchema} from "../validations/auth.validation.js";
const router = express.Router();

router.post(
  '/register',
  validate(registerSchema),
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Cria empresa e primeiro usuário (Gerente automático)
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - companyName
   *               - companyEmail
   *               - cnpj
   *               - employeeName
   *               - password
   *               - confirmPassword
   *             properties:
   *               companyName:
   *                 type: string
   *                 example: ProtocoLab
   *               companyEmail:
   *                 type: string
   *                 format: email
   *                 example: contato@protocolab.com
   *               cnpj:
   *                 type: string
   *                 example: "12345678000199"
   *               employeeName:
   *                 type: string
   *                 example: João Silva
   *               password:
   *                 type: string
   *                 example: senha123
   *               confirmPassword:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Erro de validação
   */
  authController.register
);

router.post(
  '/login',
  validate(loginSchema),
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login do usuário da empresa
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - companyEmail
   *               - employeeName
   *               - password
   *             properties:
   *               companyEmail:
   *                 type: string
   *                 format: email
   *                 example: contato@protocolab.com
   *               employeeName:
   *                 type: string
   *                 example: João Silva
   *               password:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *       401:
   *         description: Credenciais inválidas
   */
  authController.login
);

router.post(
  '/refresh',
  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Gera novo access token usando refresh token (cookie)
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Novo access token gerado
   *       401:
   *         description: Refresh token inválido ou ausente
   */
  authController.refresh
);

router.use(authMiddleware);

router.get(
  '/me',
  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Retorna dados do usuário autenticado
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados do usuário
   *       401:
   *         description: Não autorizado
   */
  authController.me
);

router.post(
  '/logout',
  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout do usuário
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout realizado com sucesso
   *       401:
   *         description: Não autorizado
   */
  authController.logout
);

export default router;
