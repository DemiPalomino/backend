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

export const getDescriptors = async (req, res) => {
  try {
    console.log(' GET /personas/descriptores - Solicitando descriptores...');
    
    const descriptors = await personaService.getAllDescriptors();
    
    console.log(`Enviando ${descriptors.length} empleados con descriptores`);
    
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
    console.error('Error completo en getDescriptors:', error);
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
    console.log(`Buscando persona con ID: ${id}`);

    if (id === 'descriptores') {
      console.error('Error: Ruta /personas/descriptores está siendo capturada por getPersona');
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

        console.log('Actualizando descriptor facial para ID:', id);
        console.log('Descriptor recibido (primeros 5 elementos):', descriptor ? descriptor.slice(0, 5) : 'No definido');

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
        console.error('Error en updateDescriptorFacial:', error);
        res.status(500).json({ error: error.message });
    }
};
