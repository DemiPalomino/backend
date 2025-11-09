import { Router } from "express";
import {
  getSucursals,
  getSucursal,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "./sucursal.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js"; 

const router = Router();

// CRUD Usuarios (todos protegidos con JWT salvo el registro si quieres)
router.get("/sucursals",verifyToken, getSucursals);
router.get("/sucursal/:id",verifyToken, getSucursal);
router.post("/sucursals/", verifyToken,createSucursal);
router.put("/sucursal/:id", verifyToken,updateSucursal);
router.delete("/sucursal/:id", verifyToken,deleteSucursal);

export default router;
