import { Router } from "express";
import {
  getCompanys,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./company.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/companies", verifyToken, getCompanys);
router.get("/companies/:id", verifyToken, getCompany);
router.post("/companies", verifyToken, requireRole([1]), createCompany);
router.put("/companies/:id", verifyToken, requireRole([1]), updateCompany);
router.delete("/companies/:id", verifyToken, requireRole([1]), deleteCompany);

export default router;