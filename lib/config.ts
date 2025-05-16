// Make sure the config file is properly set up

// For monolithic architecture, we don't need separate service URLs
// But we'll keep them for backward compatibility
export const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || "http://localhost:3001"
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002"

// For local development, we'll use direct function calls
export const isLocalDevelopment = true
