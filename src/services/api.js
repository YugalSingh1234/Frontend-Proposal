import axios from 'axios';

const API_BASE_URL = 'https://fastapi-backend-proposal.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for slow renders
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const energyAuditService = {
  // Generate energy audit proposal
  generateProposal: async (proposalData) => {
    try {
      console.log('📝 Sending proposal data:', proposalData);
      const response = await api.post('/api/process-proposal', proposalData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to generate proposal';
      
      console.error('💥 Generation error:', {
        status: error.response?.status,
        message: errorMessage,
        fullError: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  // Enhanced download with robust error handling and fallbacks
  downloadDocument: async (filename) => {
    console.log('📥 Starting download process for:', filename);
    
    // Check browser capabilities first
    const capabilities = {
      blobSupport: typeof Blob !== 'undefined',
      urlSupport: typeof window.URL !== 'undefined' && typeof window.URL.createObjectURL === 'function',
      downloadAttribute: 'download' in document.createElement('a'),
      localStorage: typeof Storage !== 'undefined'
    };
    
    console.log('🔍 Browser capabilities:', capabilities);
    
    let downloadAttempts = [];
    
    try {
      // Primary method: Blob download
      if (capabilities.blobSupport && capabilities.urlSupport && capabilities.downloadAttribute) {
        console.log('🎯 Attempting primary download method (Blob)...');
        
        const response = await api.get(`/api/download/${filename}`, {
          responseType: 'blob',
          timeout: 120000, // Extended timeout for large files
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📊 Download progress: ${percentCompleted}%`);
          }
        });
        
        console.log('✅ File received:', {
          size: response.data.size,
          type: response.data.type,
          status: response.status
        });
        
        // Validate blob content
        if (response.data.size === 0) {
          throw new Error('Empty file received from server');
        }
        
        // Create and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }));
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        
        // Try to trigger download
        try {
          link.click();
          downloadAttempts.push({ method: 'blob_click', success: true });
        } catch (clickError) {
          console.warn('⚠️ Click method failed:', clickError);
          downloadAttempts.push({ method: 'blob_click', success: false, error: clickError.message });
          
          // Fallback: trigger with event
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          link.dispatchEvent(event);
          downloadAttempts.push({ method: 'blob_event', success: true });
        }
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        console.log('✅ Primary download method completed successfully');
        return { success: true, method: 'blob', attempts: downloadAttempts };
      }
      
    } catch (primaryError) {
      console.error('❌ Primary download method failed:', primaryError);
      downloadAttempts.push({ 
        method: 'blob', 
        success: false, 
        error: primaryError.message,
        status: primaryError.response?.status,
        statusText: primaryError.response?.statusText
      });
      
      // Try fallback methods
      console.log('🔄 Attempting fallback download methods...');
      
      try {
        // Fallback 1: Direct window.open
        console.log('🎯 Attempting fallback method 1 (Direct URL)...');
        const directUrl = `${API_BASE_URL}/api/download/${filename}`;
        const newWindow = window.open(directUrl, '_blank');
        
        if (newWindow) {
          downloadAttempts.push({ method: 'direct_url', success: true });
          console.log('✅ Direct URL method completed');
          return { success: true, method: 'direct_url', attempts: downloadAttempts };
        } else {
          downloadAttempts.push({ method: 'direct_url', success: false, error: 'Popup blocked' });
        }
        
      } catch (fallback1Error) {
        downloadAttempts.push({ method: 'direct_url', success: false, error: fallback1Error.message });
      }
      
      try {
        // Fallback 2: Hidden iframe
        console.log('🎯 Attempting fallback method 2 (Hidden iframe)...');
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${API_BASE_URL}/api/download/${filename}`;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 5000);
        
        downloadAttempts.push({ method: 'iframe', success: true });
        console.log('✅ Iframe method initiated');
        return { success: true, method: 'iframe', attempts: downloadAttempts };
        
      } catch (fallback2Error) {
        downloadAttempts.push({ method: 'iframe', success: false, error: fallback2Error.message });
      }
      
      try {
        // Fallback 3: Form submission
        console.log('🎯 Attempting fallback method 3 (Form submission)...');
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = `${API_BASE_URL}/api/download/${filename}`;
        form.target = '_blank';
        form.style.display = 'none';
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        downloadAttempts.push({ method: 'form_submit', success: true });
        console.log('✅ Form submission method completed');
        return { success: true, method: 'form_submit', attempts: downloadAttempts };
        
      } catch (fallback3Error) {
        downloadAttempts.push({ method: 'form_submit', success: false, error: fallback3Error.message });
      }
      
      // All methods failed - provide detailed error information
      const errorInfo = {
        message: 'All download methods failed',
        capabilities,
        attempts: downloadAttempts,
        troubleshooting: this.generateTroubleshootingSteps(downloadAttempts, capabilities),
        timestamp: new Date().toISOString()
      };
      
      console.error('💥 All download methods failed:', errorInfo);
      throw new Error(`Download failed: ${JSON.stringify(errorInfo, null, 2)}`);
    }
  },

  // Generate troubleshooting steps based on failure patterns
  generateTroubleshootingSteps: (attempts, capabilities) => {
    const steps = [];
    
    // Check for common issues
    const hasNetworkErrors = attempts.some(a => a.error?.includes('network') || a.status >= 400);
    const hasSecurityErrors = attempts.some(a => a.error?.includes('blocked') || a.error?.includes('CORS'));
    const hasBrowserLimitations = !capabilities.blobSupport || !capabilities.urlSupport;
    const hasPopupBlocked = attempts.some(a => a.error?.includes('Popup blocked'));
    
    if (hasNetworkErrors) {
      steps.push({
        issue: 'Network/Server Issues',
        solutions: [
          'Check your internet connection',
          'Verify the backend server is running',
          'Check if corporate firewall is blocking the domain',
          'Try using a VPN or different network'
        ]
      });
    }
    
    if (hasSecurityErrors || hasPopupBlocked) {
      steps.push({
        issue: 'Security/Browser Restrictions',
        solutions: [
          'Disable popup blocker for this site',
          'Check browser download settings',
          'Try in incognito/private browsing mode',
          'Temporarily disable antivirus/firewall',
          'Add site to trusted sites list'
        ]
      });
    }
    
    if (hasBrowserLimitations) {
      steps.push({
        issue: 'Browser Compatibility',
        solutions: [
          'Update your browser to the latest version',
          'Try a different browser (Chrome, Firefox, Edge)',
          'Enable JavaScript if disabled',
          'Clear browser cache and cookies'
        ]
      });
    }
    
    // Always include general troubleshooting
    steps.push({
      issue: 'General Troubleshooting',
      solutions: [
        'Check available disk space in Downloads folder',
        'Verify Downloads folder permissions',
        'Try right-clicking the download link and "Save as"',
        'Contact IT support if on corporate network'
      ]
    });
    
    return steps;
  },

  // Get system status
  getStatus: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get system status');
    }
  },

  // Test backend connectivity
  testConnection: async () => {
    try {
      console.log('🔗 Testing backend connection...');
      const response = await api.get('/');
      console.log('✅ Backend connected successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend connection failed:', {
        message: error.message,
        status: error.response?.status,
        url: API_BASE_URL
      });
      throw error;
    }
  },
};

export default energyAuditService;