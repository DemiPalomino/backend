import { Router } from "express";
import {
  getEstadisticas,
  getReporteAsistencias,
  getEstadisticasEmpleado
} from "./dashboard.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas protegidas
router.get("/dashboard/estadisticas", verifyToken, getEstadisticas);
router.get("/dashboard/estadisticas/empleado", verifyToken, getEstadisticasEmpleado);
router.get("/dashboard/reportes/asistencias", verifyToken, getReporteAsistencias);

export default router;