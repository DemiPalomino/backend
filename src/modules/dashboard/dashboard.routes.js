import { Router } from "express";
import {
  getEstadisticas,
  getReporteAsistencias,
} from "./dashboard.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS DE DASHBOARD
router.get("/dashboard/estadisticas", verifyToken, getEstadisticas);
router.get("/dashboard/reportes/asistencias", verifyToken, requireRole([1, 2, 4]), getReporteAsistencias);

export default router;