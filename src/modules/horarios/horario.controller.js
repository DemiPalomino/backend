import { horarioService } from "./horario.service.js";

export const getHorarios = async (req, res) => {
    try {
        console.log('Solicitando lista de horarios...');
        const horarios = await horarioService.getAll();
        console.log(`Enviando ${horarios.length} horarios`);
        res.json(horarios);
    } catch (error) {
        console.error('Error en getHorarios:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getHorario = async (req, res) => {
    try {
        const horario = await horarioService.getById(req.params.id);
        if (!horario) return res.status(404).json({ error: "Horario no encontrado" }); 
        res.json(horario);
    } catch (error) {
        console.error('Error en getHorario:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createHorario = async (req, res) => {
    try {
        console.log('Creando nuevo horario:', req.body);
        const horario = await horarioService.create(req.body);
        res.status(201).json(horario);
    } catch (error) {
        console.error('Error en createHorario:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateHorario = async (req, res) => {
    try {
        const horario = await horarioService.update(req.params.id, req.body);
        res.json(horario);
    } catch (error) {
        console.error('Error en updateHorario:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteHorario = async (req, res) => {
    try {
        const result = await horarioService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error en deleteHorario:', error);
        res.status(500).json({ error: error.message });
    }
};
