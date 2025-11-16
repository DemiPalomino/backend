import { Router } from "express";
import {
  getFeriados,
  getFeriado,
  createFeriado,
  updateFeriado,
  deleteFeriado,
} from "./feriado.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();


router.get("/feriados", verifyToken, getFeriados);
router.get("/feriados/:id", verifyToken, getFeriado);
router.post("/feriados", verifyToken, requireRole([1, 4]), createFeriado);
router.put("/feriados/:id", verifyToken, requireRole([1, 4]), updateFeriado);
router.delete("/feriados/:id", verifyToken, requireRole([1]), deleteFeriado);


export default router;