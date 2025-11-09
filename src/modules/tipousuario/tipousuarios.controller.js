import { tipoUsuarioService } from "./tipousuarios.service.js";

export const getTiposUsuario = async (req, res) => {
    try {
        const tipos = await tipoUsuarioService.getAll();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTipoUsuario = async (req, res) => {
    try {
        const tipo = await tipoUsuarioService.getById(req.params.id);
        if (!tipo) return res.status(404).json({ error: "Tipo de usuario no encontrado" }); 
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTipoUsuario = async (req, res) => {
    try {
        const tipo = await tipoUsuarioService.create(req.body);
        res.status(201).json(tipo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTipoUsuario = async (req, res) => {
    try {
        const tipo = await tipoUsuarioService.update(req.params.id, req.body);
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTipoUsuario = async (req, res) => {
    try {
        const result = await tipoUsuarioService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
