import express from 'express';

import * as authController from '../controllers/auth.controller.js';

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import { registerSchema, loginSchema} from "../validations/auth.validation.js";

const router = express.Router();

router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  authController.refresh
);

router.use(authMiddleware);

router.get(
  '/me',
  authController.me
);

router.post(
  '/logout',
  authController.logout
);

export default router;
