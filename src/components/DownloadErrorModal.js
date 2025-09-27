import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const DownloadErrorModal = ({ error, onClose, onRetry }) => {
  if (!error) return null;

  let errorDetails;
  try {
    errorDetails = typeof error === 'string' ? JSON.parse(error) : error;
  } catch {
    errorDetails = { message: error.toString(), troubleshooting: [] };
  }

  const { capabilities, attempts, troubleshooting, timestamp } = errorDetails;

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getMethodName = (method) => {
    const methods = {
      'blob': 'Browser Download (Primary)',
      'direct_url': 'Direct URL',
      'iframe': 'Hidden Frame',
      'form_submit': 'Form Submission'
    };
    return methods[method] || method;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Download Failed - Diagnostic Report
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Browser Capabilities */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Browser Capabilities
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {capabilities && Object.entries(capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span className={value ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {value ? '✓ Supported' : '✗ Not Supported'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Attempts */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Download Attempts</h4>
            <div className="space-y-3">
              {attempts && attempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium">{getMethodName(attempt.method)}</span>
                    {attempt.error && (
                      <div className="text-sm text-gray-600 mt-1">
                        Error: {attempt.error}
                        {attempt.status && <span className="ml-2">Status: {attempt.status}</span>}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(attempt.success)}`}>
                    {attempt.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span className="font-medium">{attempt.success ? 'Success' : 'Failed'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Troubleshooting Steps</h4>
            {troubleshooting && troubleshooting.map((section, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h5 className="font-medium text-orange-900 mb-2">{section.issue}</h5>
                <ul className="space-y-1">
                  {section.solutions.map((solution, sIndex) => (
                    <li key={sIndex} className="text-sm text-orange-800 flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Quick Actions</h5>
            <div className="space-y-2">
              <button
                onClick={() => window.open(`https://fastapi-backend-proposal.onrender.com/api/download/${window.lastGeneratedFile}`, '_blank')}
                className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 text-sm"
              >
                📥 Try direct download link (opens in new tab)
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(`https://fastapi-backend-proposal.onrender.com/api/download/${window.lastGeneratedFile}`)}
                className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 text-sm"
              >
                📋 Copy download link to clipboard
              </button>
              <button
                onClick={() => {
                  const email = `mailto:support@company.com?subject=Download Issue&body=Download failed at ${timestamp}%0D%0AFile: ${window.lastGeneratedFile}%0D%0ADetails: ${encodeURIComponent(JSON.stringify(errorDetails, null, 2))}`;
                  window.location.href = email;
                }}
                className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 text-sm"
              >
                ✉️ Email support with error details
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadErrorModal;