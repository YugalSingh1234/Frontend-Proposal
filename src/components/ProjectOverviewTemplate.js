import React, { useState, useEffect } from 'react';
import { Edit, Eye, RotateCcw, Check, X } from 'lucide-react';

const ProjectOverviewTemplate = ({ value, onChange, errors }) => {
  const [isTemplateMode, setIsTemplateMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [templateData, setTemplateData] = useState({
    institution_name: '',
    institution_type: '',
    city: '',
    state: '',
    conditioned_area: '',
    area_unit: 'sq ft',
    primary_function: '',
    occupancy_type: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [editableContent, setEditableContent] = useState('');

  const template = `The project involves a comprehensive HVAC design for {{Institution_Name}}, an {{Institution_Type}} located in {{City}}, {{State}}. The facility comprises a conditioned area of approximately {{Conditioned_Area}} {{Area_Unit}}, designed to support a comfortable and healthy indoor environment conducive to {{Primary_Function}}. The objective is to evaluate the HVAC system design with respect to energy efficiency, thermal comfort, ventilation adequacy, and compliance with relevant codes and standards, ensuring optimization for a {{Occupancy_Type}} setting.`;

  const placeholderLabels = {
    institution_name: 'Institution Name (e.g., Green Valley Hospital, Tech University)',
    institution_type: 'Institution Type (e.g., hospital, educational institution, office complex)',
    city: 'City (e.g., Mumbai, Delhi, Bangalore)',
    state: 'State (e.g., Maharashtra, Delhi, Karnataka)',
    conditioned_area: 'Conditioned Area (e.g., 50,000)',
    area_unit: 'Area Unit',
    primary_function: 'Primary Function (e.g., patient care and medical procedures, learning and research)',
    occupancy_type: 'Occupancy Type (e.g., healthcare, educational, commercial)'
  };

  const areaUnits = ['sq ft', 'sq m', 'sqft', 'sq. ft.', 'square feet', 'square meters'];

  // Generate content from template when templateData changes
  useEffect(() => {
    if (Object.values(templateData).some(val => val.trim() !== '')) {
      let content = template;
      
      // Replace placeholders with actual values
      content = content.replace(/\{\{Institution_Name\}\}/g, templateData.institution_name || '{{Institution_Name}}');
      content = content.replace(/\{\{Institution_Type\}\}/g, templateData.institution_type || '{{Institution_Type}}');
      content = content.replace(/\{\{City\}\}/g, templateData.city || '{{City}}');
      content = content.replace(/\{\{State\}\}/g, templateData.state || '{{State}}');
      content = content.replace(/\{\{Conditioned_Area\}\}/g, templateData.conditioned_area || '{{Conditioned_Area}}');
      content = content.replace(/\{\{Area_Unit\}\}/g, templateData.area_unit || '{{Area_Unit}}');
      content = content.replace(/\{\{Primary_Function\}\}/g, templateData.primary_function || '{{Primary_Function}}');
      content = content.replace(/\{\{Occupancy_Type\}\}/g, templateData.occupancy_type || '{{Occupancy_Type}}');

      setGeneratedContent(content);
      setEditableContent(content);
    } else {
      setGeneratedContent(template);
      setEditableContent(template);
    }
  }, [templateData]);

  // Update parent component when content changes
  useEffect(() => {
    if (isEditMode) {
      onChange(editableContent);
    } else {
      onChange(generatedContent);
    }
  }, [generatedContent, editableContent, isEditMode, onChange]);

  // Initialize with existing value if provided
  useEffect(() => {
    if (value && value !== template) {
      setGeneratedContent(value);
      setEditableContent(value);
      setIsTemplateMode(false);
    }
  }, []);

  const handleTemplateDataChange = (field, fieldValue) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: fieldValue
    }));
  };

  const handleGenerateFromTemplate = () => {
    // Check if all required fields are filled
    const requiredFields = ['institution_name', 'institution_type', 'city', 'state', 'conditioned_area', 'primary_function', 'occupancy_type'];
    const missingFields = requiredFields.filter(field => !templateData[field]?.trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.map(f => placeholderLabels[f].split('(')[0]).join(', ')}`);
      return;
    }

    setIsTemplateMode(false);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleResetToTemplate = () => {
    setIsTemplateMode(true);
    setIsEditMode(false);
    setTemplateData({
      institution_name: '',
      institution_type: '',
      city: '',
      state: '',
      conditioned_area: '',
      area_unit: 'sq ft',
      primary_function: '',
      occupancy_type: ''
    });
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    setGeneratedContent(editableContent);
  };

  const handleCancelEdit = () => {
    setEditableContent(generatedContent);
    setIsEditMode(false);
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount(isEditMode ? editableContent : generatedContent);

  if (isTemplateMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Project Overview Template</h3>
          <button
            type="button"
            onClick={() => setIsTemplateMode(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Skip Template →
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            📋 Fill in the details below to generate a professional project overview:
          </p>
          <div className="text-sm text-gray-700 bg-white p-3 rounded border italic">
            {template}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(placeholderLabels).map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label.split('(')[0].trim()}
                {field !== 'area_unit' && <span className="text-red-500">*</span>}
              </label>
              {field === 'area_unit' ? (
                <select
                  value={templateData[field]}
                  onChange={(e) => handleTemplateDataChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {areaUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              ) : field === 'primary_function' ? (
                <textarea
                  value={templateData[field]}
                  onChange={(e) => handleTemplateDataChange(field, e.target.value)}
                  placeholder={label.match(/\(([^)]+)\)/)?.[1] || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              ) : (
                <input
                  type="text"
                  value={templateData[field]}
                  onChange={(e) => handleTemplateDataChange(field, e.target.value)}
                  placeholder={label.match(/\(([^)]+)\)/)?.[1] || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerateFromTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Generate Project Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Project Overview</h3>
          <p className="text-sm text-gray-500">
            Words: <span className={wordCount > 100 ? 'text-red-500 font-medium' : 'text-gray-700'}>{wordCount}</span>
            {wordCount > 100 && <span className="text-red-500 ml-1">(recommended: under 100 words)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetToTemplate}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            title="Reset to template"
          >
            <RotateCcw className="h-3 w-3" />
            Template
          </button>
          {!isEditMode ? (
            <button
              type="button"
              onClick={handleEditToggle}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <Edit className="h-3 w-3" />
              Edit
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Check className="h-3 w-3" />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditMode ? (
        <div>
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors ? 'border-red-300' : 'border-gray-300'
            }`}
            rows="6"
            placeholder="Enter detailed project description..."
          />
          {errors && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOverviewTemplate;