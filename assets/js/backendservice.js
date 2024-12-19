// backendservice.js
function getBackendServiceUrl() {
    let env = 'development';
    if (env === 'development') {
        return "http://localhost:4000";  // Your development server port
    } else {
        return "https://nenrith-backend.azurewebsites.net"; // Your production URL
    }
}

// Export the function if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = getBackendServiceUrl;
}