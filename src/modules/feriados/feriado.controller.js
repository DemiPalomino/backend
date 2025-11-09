import { feriadoService } from "./feriado.service.js";

export const getFeriados = async (req, res) => {
    try {
        const feriados = await feriadoService.getAll();
        res.json(feriados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFeriado = async (req, res) => {
    try {
        const feriado = await feriadoService.getById(req.params.id);
        if (!feriado) return res.status(404).json({ error: "Feriado no encontrado" }); 
        res.json(feriado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createFeriado = async (req, res) => {
    try {
        const feriado = await feriadoService.create(req.body);
        res.status(201).json(feriado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateFeriado = async (req, res) => {
    try {
        const feriado = await feriadoService.update(req.params.id, req.body);
        res.json(feriado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteFeriado = async (req, res) => {
    try {
        const result = await feriadoService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
