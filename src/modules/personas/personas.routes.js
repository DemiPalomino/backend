import { Router } from "express";
import {
  getPersonas,
  getPersona,
  createPersona,
  updatePersona,
  deletePersona,
  updateDescriptorFacial,
  getDescriptors,
  obtenerPersonasConDescriptores,
    registrarDescriptorFacial,
} from "./personas.controller.js";

const router = Router();

router.get("/personas", getPersonas);
router.get("/personas/descriptores", getDescriptors); 
router.get("/personas/:id", getPersona); 
router.post("/personas", createPersona);
router.put("/personas/:id", updatePersona);
router.delete("/personas/:id", deletePersona);
router.post("/personas/:id/descriptor", updateDescriptorFacial);

router.get("/personas/descriptores", obtenerPersonasConDescriptores);
router.post("/personas/:id/descriptor", registrarDescriptorFacial);

export default router;