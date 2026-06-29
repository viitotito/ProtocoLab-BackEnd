import express from "express";

import * as userController from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/authorize.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import { roles } from "../middlewares/roles.middleware.js";

import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

const router = express.Router();

router.use(authMiddleware);
router.use(authorize());

router.post(
    "/",
    validate(createUserSchema),
    roles(),
    userController.createUser
);

router.patch(
    "/:id",
    validate(updateUserSchema),
    roles(),
    userController.updateUser
);

router.get(
    "/",
    userController.listUsers
);

router.get(
    "/:id",
    userController.getUser
);

router.delete(
    "/:id",
    userController.deleteUser
);

export default router;