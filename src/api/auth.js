import api from './axios';
import { ODOO_CONFIG } from '../config';

/**
 * Perform login to Odoo using configurations from config.js
 * This establishes a session cookie that axios will use for subsequent requests.
 */
export const login = async () => {
    try {
        const response = await api.post('/web/session/authenticate', {
            jsonrpc: "2.0",
            method: "call",
            params: {
                db: ODOO_CONFIG.db,
                login: ODOO_CONFIG.login,
                password: ODOO_CONFIG.password,
            },
            id: 1
        });

        if (response.data.result && response.data.result.uid) {
            console.log("Login successful:", response.data.result.username);
            return response.data.result;
        } else {
            console.error("Login failed:", response.data);
            throw new Error(response.data.error?.data?.message || "Login failed");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
};

/**
 * Check if the current session is still valid
 */
export const checkSession = async () => {
    try {
        const response = await api.get('/web/session/check');
        return response.data.result;
    } catch (error) {
        return false;
    }
};
