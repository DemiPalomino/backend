import { Router } from "express";
import {
  getDetallesHorario,
  getDetalleHorario,
  createDetalleHorario,
  updateDetalleHorario,
  deleteDetalleHorario,
} from "./detalle.controller.js";

const router = Router();

router.get("/detalles", getDetallesHorario);
router.get("/detalle/:id", getDetalleHorario);
router.post("/detalles/", createDetalleHorario);
router.put("/detalle/:id", updateDetalleHorario);
router.delete("/detalle/:id", deleteDetalleHorario);

export default router;
