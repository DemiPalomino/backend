import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";

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

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos"
    }
}); 

app.use(helmet());
app.use(limiter);
app.use(compression());
app.use(morgan('combined'));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

app.use("/api", authRoutes);           
app.use("/api", dashboardRoutes);    
app.use("/api", userRoutes);          
app.use("/api", personaRoutes);       
app.use("/api", areasRoutes);        
app.use("/api", horarioRoutes);        
app.use("/api", detalleHorarioRoutes); 
app.use("/api", asistenciaRoutes);    
app.use("/api", permisosRoutes);      
app.use("/api", feriadosRoutes);       
app.use("/api", companyRoutes);       
app.use("/api", sucursalRoutes);       
app.use("/api", tipoUsuariosRoutes);   

app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


app.use((err, req, res, next) => {
    console.error('Error Global:', err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message 
    });
});


app.use("*", (req, res) => {
    res.status(404).json({ 
        error: "Ruta no encontrada",
        path: req.originalUrl,
        method: req.method
    });
});

export default app;