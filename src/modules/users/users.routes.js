import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/users", verifyToken, getUsers);           // LISTAR
router.get("/users/:id", verifyToken, getUser);                            // OBTENER UNO
router.post("/users", verifyToken, createUser); // CREAR
router.put("/users/:id", verifyToken, updateUser);     // ACTUALIZAR
router.delete("/users/:id", verifyToken, deleteUser);    // ELIMINAR

export default router;