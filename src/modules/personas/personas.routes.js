import { Router } from "express";
import {
  getPersonas,
  getPersona,
  createPersona,
  updatePersona,
  deletePersona,
} from "./personas.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";
import { validateRequest, personaSchema } from "../../middlewares/validation.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/personas", verifyToken, getPersonas);
router.get("/personas/:id", verifyToken, getPersona);
router.post("/personas", verifyToken, requireRole([1, 4]), validateRequest(personaSchema), createPersona);
router.put("/personas/:id", verifyToken, requireRole([1, 4]), validateRequest(personaSchema), updatePersona);
router.delete("/personas/:id", verifyToken, requireRole([1]), deletePersona);


export default router;