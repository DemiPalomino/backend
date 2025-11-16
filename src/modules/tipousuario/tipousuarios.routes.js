import { Router } from "express";
import {
  getTiposUsuario,
  getTipoUsuario,
  createTipoUsuario,
  updateTipoUsuario,
  deleteTipoUsuario,
} from "./tipousuarios.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js"; 

const router = Router();

router.get("/tipos",verifyToken, getTiposUsuario);
router.get("/tipo/:id",verifyToken, getTipoUsuario);
router.post("/tipos/", verifyToken,createTipoUsuario);
router.put("/tipo/:id",verifyToken, updateTipoUsuario);
router.delete("/tipo/:id",verifyToken, deleteTipoUsuario);


export default router;
