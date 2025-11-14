import { Router } from "express";
import {
  getAsistencias,
  getAsistencia,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  registrarAsistenciaFacial, 
  obtenerDescriptoresEmpleados, 
} from "./asistencia.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();


router.get("/asistencias", verifyToken, getAsistencias);
router.get("/asistencias/:id", verifyToken, getAsistencia);
router.post("/asistencias", verifyToken, createAsistencia);
router.put("/asistencias/:id", verifyToken,  updateAsistencia);
router.delete("/asistencias/:id", verifyToken, deleteAsistencia);
router.post("/asistencias/facial", verifyToken, registrarAsistenciaFacial);
router.get("/personas/descriptores", verifyToken, obtenerDescriptoresEmpleados);

export default router;