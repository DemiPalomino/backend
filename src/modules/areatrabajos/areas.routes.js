import { Router } from "express";
import {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
} from "./areas.controller.js";

const router = Router();

// ✅ Asegúrate de que las rutas sean consistentes
router.get("/areas", getAreas);
router.get("/areas/:id", getArea);
router.post("/areas", createArea);
router.put("/areas/:id", updateArea);
router.delete("/areas/:id", deleteArea);

export default router;