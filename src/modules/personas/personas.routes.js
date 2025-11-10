import { Router } from "express";
import {
  getPersonas,
  getPersona,
  createPersona,
  updatePersona,
  deletePersona,
} from "./personas.controller.js";


const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/personas", getPersonas);
router.get("/personas/:id", getPersona);
router.post("/personas", createPersona);
router.put("/personas/:id", updatePersona);
router.delete("/personas/:id", deletePersona);


export default router;