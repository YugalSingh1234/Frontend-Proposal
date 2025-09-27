import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FileText, Download, Plus, Trash2, Calculator, Wifi, WifiOff } from 'lucide-react';
import energyAuditService from '../services/api';
import PaymentSchedule from './PaymentSchedule';
import ExtraPointsList from './ExtraPointsList';
import DownloadErrorModal from './DownloadErrorModal';
import ProjectOverviewTemplate from './ProjectOverviewTemplate';

const EnergyAuditForm = () => {
  // Helper function to format date in Indian format (DD/MM/YYYY)
  const formatDateToIndian = (date = new Date()) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to convert date input (YYYY-MM-DD) to Indian format (DD/MM/YYYY)
  const convertToIndianFormat = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      template_name: 'Energy Audit (Industry).docx',
      for_whom_proposal_is: '',
      submitted_to: '',
      date: new Date().toISOString().split('T')[0], // Keep as YYYY-MM-DD for calendar
      cost: '',
      currency: '₹ (Indian Rupees)',
      project_overview: '',
    }
  });

  const [extraPoints, setExtraPoints] = useState([]);
  const [paymentItems, setPaymentItems] = useState([
    { title: 'Along with Work order', percent: 25.0 },
    { title: 'After completion of Onsite Testing', percent: 25.0 },
    { title: 'After Preliminary Report', percent: 25.0 },
    { title: 'After Final Report', percent: 25.0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [backendStatus, setBackendStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'
  const [downloadError, setDownloadError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await energyAuditService.testConnection();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
        toast.error('Backend connection failed. Please check your internet connection.');
      }
    };
    
    testConnection();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Check backend connection first
      if (backendStatus === 'disconnected') {
        toast.error('Backend is disconnected. Please check your connection and try again.');
        return;
      }

      // Validate payment percentages
      const totalPercent = paymentItems.reduce((sum, item) => sum + item.percent, 0);
      if (Math.abs(totalPercent - 100) > 0.01) {
        toast.error(`Payment percentages must sum to 100%. Current total: ${totalPercent}%`);
        return;
      }

      const requestData = {
        ...data,
        date: convertToIndianFormat(data.date), // Convert date to Indian format
        extra_points: extraPoints.filter(point => point.trim() !== ''),
        payment_items: paymentItems.filter(item => item.title.trim() !== '' && item.percent > 0),
      };

      console.log('📤 Submitting request data:', requestData);

      const response = await energyAuditService.generateProposal(requestData);
      
      setGeneratedFile(response.output_file);
      toast.success('Energy audit proposal generated successfully!');
      setBackendStatus('connected'); // Update status on successful call
    } catch (error) {
      console.error('💥 Form submission error:', error);
      
      // Check if it's a network error
      if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
        setBackendStatus('disconnected');
        toast.error('Network error: Cannot connect to backend server. Please check if the backend is running.');
      } else if (error.message.includes('timeout')) {
        toast.error('Request timed out. The backend might be slow to respond. Please try again.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedFile) return;
    
    setIsDownloading(true);
    setDownloadError(null);
    
    // Store filename globally for error modal actions
    window.lastGeneratedFile = generatedFile;
    
    try {
      const result = await energyAuditService.downloadDocument(generatedFile);
      
      if (result.success) {
        toast.success(`Document downloaded successfully using ${result.method} method!`);
        console.log('📥 Download completed:', result);
      } else {
        throw new Error('Download failed without specific error');
      }
      
    } catch (error) {
      console.error('💥 Download error in component:', error);
      
      // Try to parse detailed error information
      let errorDetails;
      try {
        errorDetails = JSON.parse(error.message);
      } catch {
        errorDetails = {
          message: error.message,
          capabilities: {},
          attempts: [{ method: 'unknown', success: false, error: error.message }],
          troubleshooting: [{
            issue: 'Unknown Error',
            solutions: [
              'Check your internet connection',
              'Try refreshing the page',
              'Contact support if issue persists'
            ]
          }],
          timestamp: new Date().toISOString()
        };
      }
      
      setDownloadError(errorDetails);
      
      // Show brief toast, detailed info in modal
      toast.error('Download failed - Click for details');
      
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetryDownload = () => {
    setDownloadError(null);
    handleDownload();
  };

  const handleCloseErrorModal = () => {
    setDownloadError(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Energy Audit Proposal Form
            </h2>
            <p className="text-gray-600 mt-1">Fill in the details to generate your professional proposal</p>
          </div>
          
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2">
            {backendStatus === 'connected' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <Wifi className="h-4 w-4" />
                Backend Connected
              </div>
            )}
            {backendStatus === 'disconnected' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                <WifiOff className="h-4 w-4" />
                Backend Disconnected
              </div>
            )}
            {backendStatus === 'unknown' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700"></div>
                Checking Connection...
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                {...register('for_whom_proposal_is', { required: 'Client name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ABC Manufacturing Ltd"
              />
              {errors.for_whom_proposal_is && (
                <p className="text-red-500 text-sm mt-1">{errors.for_whom_proposal_is.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submitted To *
              </label>
              <input
                {...register('submitted_to', { required: 'Contact person is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mr. Rajesh Kumar"
              />
              {errors.submitted_to && (
                <p className="text-red-500 text-sm mt-1">{errors.submitted_to.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                {...register('currency', { required: 'Currency is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="₹ (Indian Rupees)">₹ (Indian Rupees)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost *
              </label>
              <input
                {...register('cost', { required: 'Cost is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="12,50,000"
              />
              {errors.cost && (
                <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section>
          <ProjectOverviewTemplate 
            value={watch('project_overview')}
            onChange={(value) => setValue('project_overview', value)}
            errors={errors.project_overview}
          />
          {/* Hidden input to register with react-hook-form */}
          <input
            type="hidden"
            {...register('project_overview', {
              validate: (value) => {
                if (!value || value.trim() === '') {
                  return 'Project overview is required';
                }
                return true;
              }
            })}
          />
        </section>

        {/* Extra Points */}
        <ExtraPointsList 
          extraPoints={extraPoints}
          setExtraPoints={setExtraPoints}
        />

        {/* Payment Schedule */}
        <PaymentSchedule 
          paymentItems={paymentItems}
          setPaymentItems={setPaymentItems}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {generatedFile && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Document
                  </>
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Proposal
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Download Error Modal */}
      <DownloadErrorModal 
        error={downloadError}
        onClose={handleCloseErrorModal}
        onRetry={handleRetryDownload}
      />
    </div>
  );
};

export default EnergyAuditForm;