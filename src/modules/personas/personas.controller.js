import { personaService } from "./personas.service.js";

export const getPersonas = async (req, res) => {
    try {
        const personas = await personaService.getAll();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDescriptors = async (req, res) => {
  try {
    
    const descriptors = await personaService.getAllDescriptors();
    
    // Asegurar que siempre devolvemos un array
    const result = descriptors || [];
    
    // Log para debugging
    if (result.length > 0) {
      console.log('Primer empleado:', {
        id: result[0].id_persona,
        nombre: result[0].nombres,
        descriptor_length: result[0].descriptor?.length
      });
    }
    
    res.json(result);
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: 'Error al obtener lista de descriptores faciales',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getPersona = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'descriptores') {
      return res.status(404).json({ 
        error: "Ruta no encontrada. Use /api/personas/descriptores" 
      });
    }
    
    const persona = await personaService.getById(id);
    if (!persona) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPersona = async (req, res) => {
    try {
        const persona = await personaService.create(req.body);
        res.status(201).json(persona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePersona = async (req, res) => {
    try {
        const persona = await personaService.update(req.params.id, req.body);
        res.json(persona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePersona = async (req, res) => {
    try {
        const result = await personaService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateDescriptorFacial = async (req, res) => {
    try {
        const { id } = req.params;
        const { descriptor } = req.body;

        if (!descriptor || !Array.isArray(descriptor)) {
            return res.status(400).json({ error: "Descriptor facial requerido y debe ser un array" });
        }

        // Convertir el array a JSON string para almacenar en la BD
        const descriptorJSON = JSON.stringify(descriptor);

        const result = await personaService.updateDescriptorFacial(id, descriptorJSON);
        
        res.json({ 
            message: "Descriptor facial actualizado correctamente", 
            id_persona: parseInt(id),
            elementos_descriptor: descriptor.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// En personas.controller.js (backend)
export const obtenerPersonasConDescriptores = async (req, res) => {
    try {
        const personas = await personasService.obtenerConDescriptores();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registrarDescriptorFacial = async (req, res) => {
    try {
        const { id } = req.params;
        const { descriptor } = req.body;
        
        await personasService.actualizarDescriptor(id, descriptor);
        res.json({ message: 'Descriptor facial registrado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};