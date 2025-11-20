import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../config/db.js";
import { JWT_SECRET, JWT_EXPIRES } from "../../config/config.js";
export const authService = {
  login: async (usuario, password) => {
    const [rows] = await db.query(`
      SELECT u.*, p.id_persona, p.nombres, p.apellidos 
      FROM usuarios u 
      LEFT JOIN personas p ON u.id_persona = p.id_persona 
      WHERE u.nombre_usuario = ?`,
      [usuario]
    );

    if (rows.length === 0) throw new Error("Usuario no encontrado");

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    const token = jwt.sign(
      {
        id: user.id_usuario,
        user: user.nombre_usuario,
        role: user.id_tipo_usuario,
        id_persona: user.id_persona,
        nombres: user.nombres,
        apellidos: user.apellidos
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return {
      token,
      user: {
        id: user.id_usuario,
        user: user.nombre_usuario,
        role: user.id_tipo_usuario,
        id_persona: user.id_persona,
        nombres: user.nombres,
        apellidos: user.apellidos
      }
    };
  },
};