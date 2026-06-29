import express from "express";

import * as departmentController from "../controllers/department.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/authorize.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import { createDepartmentSchema, updateDepartmentSchema } from "../validations/department.validation.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorize());