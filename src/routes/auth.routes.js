import express from 'express';
import * as authController from '../controllers/auth.controller.js';

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh', authController.refresh);

router.use(authMiddleware);

router.post('/logout', authController.logout);

router.get('/me', authController.me);

export default router;