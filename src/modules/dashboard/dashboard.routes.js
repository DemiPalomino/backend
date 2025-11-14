import { Router } from "express";
import {
  getEstadisticas,
  getReporteAsistencias,
} from "./dashboard.controller.js";


const router = Router();


router.get("/dashboard/estadisticas", getEstadisticas);
router.get("/dashboard/reportes/asistencias", getReporteAsistencias);

export default router;