import { Router } from "express";
import {
  getAsistencias,
  getAsistencia,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  registrarAsistenciaFacial
} from "./asistencia.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
const router = Router();
router.get("/asistencias", verifyToken, getAsistencias);
router.get("/asistencias/:id", verifyToken, getAsistencia);
router.post("/asistencias", verifyToken, createAsistencia);
router.put("/asistencias/:id", verifyToken,  updateAsistencia);
router.delete("/asistencias/:id", verifyToken, deleteAsistencia);
router.post("/asistencias/facial", verifyToken, registrarAsistenciaFacial);

export default router;