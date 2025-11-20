import { personaService } from "./personas.service.js";

export const getPersonas = async (req, res) => {
    try {
        const personas = await personaService.getAll();
        res.json(personas);
    } catch (error) {
        console.error('Error en getPersonas:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getPersona = async (req, res) => {
    try {
        const persona = await personaService.getById(req.params.id);
        if (!persona) return res.status(404).json({ error: "Persona no encontrada" }); 
        res.json(persona);
    } catch (error) {
        console.error('Error en getPersona:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createPersona = async (req, res) => {
    try {
        console.log('Creando persona con datos:', req.body);
        const persona = await personaService.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        console.error('Error en createPersona:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updatePersona = async (req, res) => {
    try {
        const persona = await personaService.update(req.params.id, req.body);
        res.json(persona);
    } catch (error) {
        console.error('Error en updatePersona:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deletePersona = async (req, res) => {
    try {
        const result = await personaService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error en deletePersona:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateDescriptorFacial = async (req, res) => {
    try {
        const { id } = req.params;
        const { descriptor } = req.body;

        if (!descriptor || !Array.isArray(descriptor)) {
            return res.status(400).json({ error: "Descriptor facial requerido" });
        }

        const result = await personaService.updateDescriptorFacial(id, descriptor);
        res.json({ message: "Descriptor facial actualizado correctamente", result });
    } catch (error) {
        console.error('Error en updateDescriptorFacial:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getDescriptors = async (req, res) => {
    try {
        const descriptors = await personaService.getAllDescriptors();
        res.json(descriptors);
    } catch (error) {
        console.error('Error en getDescriptors:', error);
        res.status(500).json({ error: error.message });
    }
};