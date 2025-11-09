import { detalleHorarioService } from "./detalle.service.js";

export const getDetallesHorario = async (req, res) => {
    try {
        const detalles = await detalleHorarioService.getAll();
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDetalleHorario = async (req, res) => {
    try {
        const detalle = await detalleHorarioService.getById(req.params.id);
        if (!detalle) return res.status(404).json({ error: "Detalle de horario no encontrado" }); 
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createDetalleHorario = async (req, res) => {
    try {
        const detalle = await detalleHorarioService.create(req.body);
        res.status(201).json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateDetalleHorario = async (req, res) => {
    try {
        const detalle = await detalleHorarioService.update(req.params.id, req.body);
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteDetalleHorario = async (req, res) => {
    try {
        const result = await detalleHorarioService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
