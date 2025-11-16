import { Router } from "express";
import {
  getPermisos,
  getPermiso,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "./permisos.controller.js";


const router = Router();

router.get("/permisos", getPermisos);
router.get("/permisos/:id", getPermiso);
router.post("/permisos", createPermiso); 
router.put("/permisos/:id", updatePermiso);
router.delete("/permisos/:id", deletePermiso);


export default router;