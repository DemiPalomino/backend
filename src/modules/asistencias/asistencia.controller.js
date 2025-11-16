import { asistenciaService } from "./asistencia.service.js";

export const getAsistencias = async (req, res) => {
    try {
        const asistencias = await asistenciaService.getAll();
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAsistencia = async (req, res) => {
    try {
        const asistencia = await asistenciaService.getById(req.params.id);
        if (!asistencia) return res.status(404).json({ error: "Asistencia no encontrada" }); 
        res.json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createAsistencia = async (req, res) => {
    try {
        const asistencia = await asistenciaService.create(req.body);
        res.status(201).json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAsistencia  = async (req, res) => {
    try {
        const asistencia = await asistenciaService.update(req.params.id, req.body);
        res.json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAsistencia = async (req, res) => {
    try {
        const result = await asistenciaService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registrarAsistenciaFacial = async (req, res) => {
  try {
    const { id_persona } = req.body;
    
    if (!id_persona) {
      return res.status(400).json({ error: "ID de persona requerido" });
    }

    const resultado = await asistenciaService.registrarAsistenciaFacial(id_persona);
    res.json(resultado);
  } catch (error) {
    console.error('Error en registro facial:', error);
    res.status(500).json({ 
      error: error.message || "Error al registrar asistencia facial" 
    });
  }
};

export const obtenerDescriptoresEmpleados = async (req, res) => {
    try {
        console.log('📋 Solicitando descriptores de empleados...');
        const descriptores = await asistenciaService.obtenerDescriptoresEmpleados();
        
        console.log(`✅ Descriptores obtenidos: ${descriptores.length} empleados`);
        
        if (descriptores.length === 0) {
            console.log('⚠️ No hay empleados con descriptores faciales registrados');
            return res.json([]); 
        }
        
        res.json(descriptores);
    } catch (error) {
        console.error('❌ Error obteniendo descriptores:', error);
      
        res.json([]);
    }
};

export const reconocerYRegistrarAsistencia = async (req, res) => {
  try {
    const { descriptor } = req.body;
    
    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ 
        error: "Descriptor facial requerido",
        code: "MISSING_DESCRIPTOR"
      });
    }

    const resultado = await asistenciaService.reconocerYRegistrarAsistencia(descriptor);
    
    res.json({
      success: true,
      ...resultado
    });
    
  } catch (error) {
    console.error('Error en reconocimiento facial:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: "RECOGNITION_ERROR"
    });
  }
};
