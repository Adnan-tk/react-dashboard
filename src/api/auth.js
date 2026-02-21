import api from './axios';
import { ODOO_CONFIG } from '../config';

/**
 * Perform login to Odoo using configurations from config.js
 * This establishes a session cookie that axios will use for subsequent requests.
 */
export const login = async () => {
    try {
        // Log the credentials being used (for debugging)
        console.log("Attempting login with:", {
            db: ODOO_CONFIG.db,
            login: ODOO_CONFIG.login,
            url: ODOO_CONFIG.url
        });

        const payload = {
            jsonrpc: "2.0",
            method: "call",
            params: {
                db: ODOO_CONFIG.db,
                login: ODOO_CONFIG.login,
                password: ODOO_CONFIG.password,
            },
            id: 1
        };

        console.log("Request payload:", { ...payload, params: { ...payload.params, password: "***" } });

        const response = await api.post('/web/session/authenticate', payload);

        console.log("Login response:", response.data);

        if (response.data.result && response.data.result.uid) {
            console.log("Login successful:", response.data.result.username);
            return response.data.result;
        } else {
            console.error("Login failed:", response.data);
            throw new Error(response.data.error?.data?.message || "Login failed");
        }
    } catch (error) {
        console.error("Authentication error:", error.message);
        console.error("Error details:", error.response?.data || error);
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
