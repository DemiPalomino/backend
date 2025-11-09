import { authService } from "./auth.service.js";

export const login = async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        const data = await authService.login(usuario, password);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
