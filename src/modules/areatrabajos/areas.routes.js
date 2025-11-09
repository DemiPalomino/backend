import { Router } from "express";
import {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
} from "./areas.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";
import { validateRequest, areaSchema } from "../../middlewares/validation.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/areas", verifyToken, getAreas);
router.get("/areas/:id", verifyToken, getArea);
router.post("/areas", verifyToken, requireRole([1, 4]), validateRequest(areaSchema), createArea);
router.put("/areas/:id", verifyToken, requireRole([1, 4]), validateRequest(areaSchema), updateArea);
router.delete("/areas/:id", verifyToken, requireRole([1]), deleteArea);

export default router;