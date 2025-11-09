import { areasService } from "./areas.service.js";

export const getAreas = async (req, res) => {
    try {
        const areas = await areasService.getAll();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getArea = async (req, res) => {
    try {
        const area = await areasService.getById(req.params.id);
        if (!area) return res.status(404).json({ error: "Area no encontrada" }); 
        res.json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createArea = async (req, res) => {
    try {
        const area = await areasService.create(req.body);
        res.status(201).json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateArea = async (req, res) => {
    try {
        const area = await areasService.update(req.params.id, req.body);
        res.json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteArea = async (req, res) => {
    try {
        const result = await areasService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
