import { Router } from "express";
import {
  getEstadisticas,
  getReporteAsistencias,
  getEstadisticasEmpleado,
  getAreasConEmpleados
} from "./dashboard.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard/estadisticas", verifyToken, getEstadisticas);
router.get("/dashboard/estadisticas/empleado", verifyToken, getEstadisticasEmpleado);
router.get("/dashboard/reportes/asistencias", verifyToken, getReporteAsistencias);
router.get("/dashboard/areas", verifyToken, getAreasConEmpleados);

export default router;