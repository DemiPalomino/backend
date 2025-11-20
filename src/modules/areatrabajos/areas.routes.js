import { Router } from "express";
import {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
} from "./areas.controller.js";
const router = Router();
router.get("/areas", getAreas);
router.get("/areas/:id", getArea);
router.post("/areas", createArea);
router.put("/areas/:id", updateArea);
router.delete("/areas/:id", deleteArea);

export default router;