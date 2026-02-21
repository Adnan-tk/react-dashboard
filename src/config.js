// Load credentials from environment variables with fallbacks for development
export const ODOO_CONFIG = {
    db: import.meta.env.VITE_ODOO_DB || "odoo16_test",
    login: import.meta.env.VITE_ODOO_LOGIN || "admin",
    password: import.meta.env.VITE_ODOO_PASSWORD || "admin",
    url: import.meta.env.VITE_ODOO_URL || "http://13.201.55.28"
};

// Debug: Log config in development (remove credentials from logs in production)
if (import.meta.env.DEV) {
    console.log("ODOO Config:", {
        db: ODOO_CONFIG.db,
        login: ODOO_CONFIG.login,
        url: ODOO_CONFIG.url,
        passwordSet: !!ODOO_CONFIG.password
    });
}

export default ODOO_CONFIG;