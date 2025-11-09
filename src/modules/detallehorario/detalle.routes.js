import { Router } from "express";
import {
  getDetallesHorario,
  getDetalleHorario,
  createDetalleHorario,
  updateDetalleHorario,
  deleteDetalleHorario,
} from "./detalle.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// CRUD Usuarios (todos protegidos con JWT salvo el registro si quieres)
router.get("/detalles",verifyToken, getDetallesHorario);
router.get("/detalle/:id",verifyToken, getDetalleHorario);
router.post("/detalles/",verifyToken, createDetalleHorario);
router.put("/detalle/:id",verifyToken, updateDetalleHorario);
router.delete("/detalle/:id",verifyToken, deleteDetalleHorario);

export default router;
