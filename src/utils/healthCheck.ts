const checkServiceHealth = async () => {
    try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/health`);
        console.log('Health check status:', response.status);
    } catch (error) {
        console.error('Health check failed:', error);
    }
};

export const startHealthCheck = () => {
    // Primeira verificação imediata
    checkServiceHealth();
    
    // Depois a cada 10 minutos
    setInterval(checkServiceHealth, 10 * 60 * 1000);
};