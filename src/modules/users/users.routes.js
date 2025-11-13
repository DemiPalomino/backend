import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// ✅ RUTAS ESTANDARIZADAS
router.get("/users", verifyToken, getUsers);           
router.get("/users/:id", verifyToken, getUser);                            
router.post("/users", verifyToken, createUser); 
router.put("/users/:id", verifyToken, updateUser);   
router.delete("/users/:id", verifyToken, deleteUser);    

export default router;