import { Router } from "express";
import {
  getFeriados,
  getFeriado,
  createFeriado,
  updateFeriado,
  deleteFeriado,
} from "./feriado.controller.js";
const router = Router();
router.get("/feriados", getFeriados);
router.get("/feriados/:id", getFeriado);
router.post("/feriados", createFeriado);
router.put("/feriados/:id", updateFeriado);
router.delete("/feriados/:id", deleteFeriado);

export default router;