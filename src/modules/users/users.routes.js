import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";
import { validateRequest, userSchema } from "../../middlewares/validation.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/users", verifyToken, requireRole([1, 4]), getUsers);           // LISTAR
router.get("/users/:id", verifyToken, getUser);                            // OBTENER UNO
router.post("/users", verifyToken, requireRole([1]), validateRequest(userSchema), createUser); // CREAR
router.put("/users/:id", verifyToken, validateRequest(userSchema), updateUser);     // ACTUALIZAR
router.delete("/users/:id", verifyToken, requireRole([1]), deleteUser);    // ELIMINAR

export default router;