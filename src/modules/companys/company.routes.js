import { Router } from "express";
import {
  getCompanys,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./company.controller.js";


const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/companies", getCompanys);
router.get("/companies/:id", getCompany);
router.post("/companies", createCompany);
router.put("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

export default router;