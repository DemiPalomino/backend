// Crear: modules/dashboard/dashboard.controller.js
import { dashboardService } from "./dashboard.service.js";

export const getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await dashboardService.getEstadisticas();
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReporteAsistencias = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_area } = req.query;
        const reporte = await dashboardService.generarReporteAsistencias(fecha_inicio, fecha_fin, id_area);
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};