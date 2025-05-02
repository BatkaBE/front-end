// utils/api.js

/**
 * Enhanced fetch wrapper with better error handling
 */
export const secureFetch = async (url, options = {}) => {
  // Store the original error setting
  const originalRejectSetting = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  
  try {
    // Only ignore SSL in development
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });

    // Handle HTTP errors (status codes 4xx/5xx)
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() || 'Unknown error' };
      }
      
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    // Enhanced error logging
    console.error('API call failed:', {
      url,
      status: error.status || 'N/A',
      message: error.message,
      data: error.data || 'No additional data',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    
    // Re-throw with more context
    throw new Error(`API request to ${url} failed: ${error.message}`);
  } finally {
    // Restore original SSL setting
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectSetting;
  }
};

/**
 * Enhanced file upload with better error handling
 */
export const uploadFile = async (url, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() || 'Upload failed' };
      }
      
      const error = new Error(errorData.message || `Upload failed with status ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('File upload failed:', {
      url,
      error: error.message,
      status: error.status || 'N/A',
    });
    throw error;
  }
};