import { Router } from "express";
import {
  getHorarios,
  getHorario,
  createHorario,
  updateHorario,
  deleteHorario,
} from "./horario.controller.js";


const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/horarios", getHorarios);
router.get("/horarios/:id", getHorario);
router.post("/horarios", createHorario);
router.put("/horarios/:id", updateHorario);
router.delete("/horarios/:id", deleteHorario);


export default router;