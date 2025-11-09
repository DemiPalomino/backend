import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";

// ✅ Importación de rutas
import userRoutes from "./modules/users/users.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import companyRoutes from "./modules/companys/company.routes.js";
import horarioRoutes from "./modules/horarios/horario.routes.js";
import personaRoutes from "./modules/personas/personas.routes.js";
import asistenciaRoutes from "./modules/asistencias/asistencia.routes.js";
import areasRoutes from "./modules/areatrabajos/areas.routes.js";
import feriadosRoutes from "./modules/feriados/feriado.routes.js";
import detalleHorarioRoutes from "./modules/detallehorario/detalle.routes.js";
import permisosRoutes from "./modules/permisos/permisos.routes.js";
import sucursalRoutes from "./modules/sucursal/sucursal.routes.js";
import tipoUsuariosRoutes from "./modules/tipousuario/tipousuarios.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

// ✅ app definido AL INICIO
const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos"
    }
});

// ✅ Middlewares en ORDEN CORRECTO
app.use(helmet());
app.use(limiter);
app.use(compression());
app.use(morgan('combined'));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Aumentar límites para facial recognition
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging personalizado
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// RUTAS ESTANDARIZADAS - ORDEN JERÁRQUICO
app.use("/api", authRoutes);           // Autenticación primero
app.use("/api", dashboardRoutes);      // Dashboard
app.use("/api", userRoutes);           // Usuarios
app.use("/api", personaRoutes);        // Personas
app.use("/api", areasRoutes);          // Áreas
app.use("/api", horarioRoutes);        // Horarios
app.use("/api", detalleHorarioRoutes); // Detalles de horario
app.use("/api", asistenciaRoutes);     // Asistencias
app.use("/api", permisosRoutes);       // Permisos
app.use("/api", feriadosRoutes);       // Feriados
app.use("/api", companyRoutes);        // Empresa
app.use("/api", sucursalRoutes);       // Sucursales
app.use("/api", tipoUsuariosRoutes);   // Tipos de usuario

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error Global:', err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message 
    });
});

// Ruta no encontrada
app.use("*", (req, res) => {
    res.status(404).json({ 
        error: "Ruta no encontrada",
        path: req.originalUrl,
        method: req.method
    });
});

export default app;