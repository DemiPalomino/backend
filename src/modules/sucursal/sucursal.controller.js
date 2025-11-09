import { sucursalService } from "./sucursal.service.js";

export const getSucursals = async (req, res) => {
    try {
        const sucursals = await sucursalService.getAll();
        res.json(sucursals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSucursal= async (req, res) => {
    try {
        const sucursal = await sucursalService.getById(req.params.id);
        if (!sucursal) return res.status(404).json({ error: "Sucursal incorrecta" }); 
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createSucursal = async (req, res) => {
    try {
        const sucursal = await sucursalService.create(req.body);
        res.status(201).json(sucursal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSucursal = async (req, res) => {
    try {
        const sucursal = await sucursalService.update(req.params.id, req.body);
        res.json(sucursal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSucursal = async (req, res) => {
    try {
        const result = await sucursalService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
