import { Router } from "express";
import {
  getAsistencias,
  getAsistencia,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
} from "./asistencia.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS - CRUD BÁSICO
router.get("/asistencias", verifyToken, getAsistencias);
router.get("/asistencias/:id", verifyToken, getAsistencia);
router.post("/asistencias", verifyToken, requireRole([1, 4]), createAsistencia);
router.put("/asistencias/:id", verifyToken, requireRole([1, 4]), updateAsistencia);
router.delete("/asistencias/:id", verifyToken, requireRole([1]), deleteAsistencia);



export default router;