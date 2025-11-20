import { Router } from "express";
import {
  getSucursals,
  getSucursal,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "./sucursal.controller.js";
const router = Router();
router.get("/sucursales",  getSucursals);
router.get("/sucursales/:id",getSucursal);
router.post("/sucursales", createSucursal);
router.put("/sucursales/:id", updateSucursal);
router.delete("/sucursales/:id", deleteSucursal);

export default router;
