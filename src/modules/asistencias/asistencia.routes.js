import { Router } from "express";
import {
  getAsistencias,
  getAsistencia,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  registrarAsistenciaFacial
} from "./asistencia.controller.js";
const router = Router();
router.get("/asistencias",  getAsistencias);
router.get("/asistencias/:id", getAsistencia);
router.post("/asistencias", createAsistencia);
router.put("/asistencias/:id", updateAsistencia);
router.delete("/asistencias/:id", deleteAsistencia);
router.post("/asistencias/facial", registrarAsistenciaFacial);

export default router;
