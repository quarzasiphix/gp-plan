
// API Utilities for handling requests and CORS
const API_BASE_URL = 'https://gp.quarza.online/api/routes.php';

// Enhanced CORS proxy with better error handling and alternative proxies
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
    
    // Try with multiple CORS proxies in sequence
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    
    let lastError = directError;
    
    // Try each proxy in sequence
    for (const proxyUrl of corsProxies) {
      try {
        const fullProxyUrl = `${proxyUrl}${encodeURIComponent(url)}`;
        console.log(`Trying with CORS proxy: ${fullProxyUrl}`);
        
        const proxyResponse = await fetch(fullProxyUrl, {
          ...options,
          headers: {
            ...options.headers,
            'Origin': window.location.origin
          }
        });
        
        if (!proxyResponse.ok) {
          const errorText = await proxyResponse.text();
          console.error(`Proxy error (${proxyUrl}):`, errorText);
          throw new Error(`Proxy API error: ${proxyResponse.status} - ${errorText || 'No error details provided'}`);
        }
        
        return proxyResponse;
      } catch (proxyError) {
        console.error(`Failed with proxy ${proxyUrl}:`, proxyError);
        lastError = proxyError;
        // Continue to the next proxy
      }
    }
    
    // If we get here, all proxies failed
    console.error('All fetch attempts failed:', lastError);
    throw new Error(`CORS Error: Unable to connect to the API. Please ensure you have CORS permissions or use a proxy. Details: ${lastError.message}`);
  }
};

// Get the full API URL for a specific endpoint - now using query parameters
export const getApiUrl = (id?: string | number) => {
  // The API now expects query parameter format: ?id=X
  if (!id) {
    return API_BASE_URL;
  }
  
  // For route by ID, use query parameter format
  return `${API_BASE_URL}?id=${id}`;
};
