import { Router } from "express";
import {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "./permisos.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/permisos", verifyToken, getPermisos);
router.get("/permisos/:id", verifyToken, getPermiso);
router.post("/permisos", verifyToken, createPermiso); // Empleados pueden solicitar
router.put("/permisos/:id", verifyToken, requireRole([1, 4]), updatePermiso);
router.delete("/permisos/:id", verifyToken, requireRole([1]), deletePermiso);


export default router;