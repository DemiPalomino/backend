import { companyService } from "./company.service.js";

export const getCompanys = async (req, res) => {
    try {
        const companys = await companyService.getAll();
        res.json(companys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCompany = async (req, res) => {
    try {
        const company = await companyService.getById(req.params.id);
        if (!company) return res.status(404).json({ error: "Empresa incorrecta" }); 
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCompany = async (req, res) => {
    try {
        const company = await companyService.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const company = await companyService.update(req.params.id, req.body);
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const result = await companyService.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
