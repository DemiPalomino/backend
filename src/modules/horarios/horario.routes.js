import { Router } from "express";
import {
  getHorarios,
  getHorario,
  createHorario,
  updateHorario,
  deleteHorario,
} from "./horario.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/horarios", verifyToken, getHorarios);
router.get("/horarios/:id", verifyToken, getHorario);
router.post("/horarios", verifyToken, requireRole([1, 4]), createHorario);
router.put("/horarios/:id", verifyToken, requireRole([1, 4]), updateHorario);
router.delete("/horarios/:id", verifyToken, requireRole([1]), deleteHorario);


export default router;