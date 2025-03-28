
// API Utilities for handling requests and CORS
const API_BASE_URL = 'https://gp.quarza.online/api/routes.php';

// Use a CORS proxy if needed
export const fetchWithCORS = async (url: string, options: RequestInit = {}) => {
  // Try direct first
  try {
    console.log(`Attempting direct fetch to: ${url}`);
    const response = await fetch(url, options);
    if (response.ok) return response;
    
    // If direct fetch failed with CORS error, throw to try proxy
    throw new Error('Direct fetch failed');
  } catch (directError) {
    console.log('Direct fetch failed, trying with CORS proxy');
    
    // Try with CORS proxy
    try {
      // Use a CORS proxy
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const proxyUrl = `${corsProxyUrl}${url}`;
      
      console.log(`Trying with CORS proxy: ${proxyUrl}`);
      
      const proxyResponse = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options.headers,
          'Origin': window.location.origin
        }
      });
      
      if (!proxyResponse.ok) {
        const errorText = await proxyResponse.text();
        throw new Error(`Proxy API error: ${proxyResponse.status} - ${errorText || 'No error details provided'}`);
      }
      
      return proxyResponse;
    } catch (proxyError) {
      console.error('Both direct and proxy fetch attempts failed:', proxyError);
      throw new Error(`CORS Error: Unable to connect to the API. Please ensure you have CORS permissions or use a proxy. Details: ${proxyError.message}`);
    }
  }
};

// Get the full API URL for a specific endpoint
export const getApiUrl = (endpoint?: string | number) => {
  if (!endpoint) {
    return API_BASE_URL;
  }
  return `${API_BASE_URL}/${endpoint}`;
};
