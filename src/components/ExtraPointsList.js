import React, { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

const ExtraPointsList = ({ extraPoints, setExtraPoints }) => {
  const [newPoint, setNewPoint] = useState('');

  const addExtraPoint = () => {
    if (newPoint.trim() !== '') {
      setExtraPoints([...extraPoints, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const removeExtraPoint = (index) => {
    setExtraPoints(extraPoints.filter((_, i) => i !== index));
  };

  const updateExtraPoint = (index, value) => {
    const updated = extraPoints.map((point, i) => i === index ? value : point);
    setExtraPoints(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExtraPoint();
    }
  };

  // Predefined terms and conditions
  const defaultTerms = [
    'GST shall be extra applicable as per government norms at the time of realization.',
    'Basis of Quotation: The quotation is furnished which is only valid for the scope that has been indicated in the quote & the data provided.',
    'This proposal is prepared based on the information provided by the client and valid for the scope of work mentioned above, any deviation from this information the charges may need to be altered accordingly.',
    'The cost towards travel, accommodation and food charges is not considered in the proposal and will be charged extra.',
    'The project cost is considered if the project is concluded within one month. In case the project timeline goes beyond one month after going through the detailed data of the project, the project cost must be apprehended as per the revised timeline.',
    'The client shall ensure that the necessary data required for the said industry is provided.',
    'Any delay on account of data sharing shall not be covered in the responsibility of D2O.',
    'The payments shall be billed as per the said stages and milestones of the project.'
  ];

  const addDefaultTerm = (term) => {
    if (!extraPoints.includes(term)) {
      setExtraPoints([...extraPoints, term]);
    }
  };

  const loadAllDefaultTerms = () => {
    const newTerms = defaultTerms.filter(term => !extraPoints.includes(term));
    setExtraPoints([...extraPoints, ...newTerms]);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Terms & Conditions
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {extraPoints.length} term{extraPoints.length !== 1 ? 's' : ''}
          </span>
          {extraPoints.length === 0 && (
            <button
              type="button"
              onClick={loadAllDefaultTerms}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Load Default Terms
            </button>
          )}
        </div>
      </div>

      {/* Add New Term */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new term or condition..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={addExtraPoint}
          disabled={!newPoint.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Default Terms Suggestions */}
      {extraPoints.length < defaultTerms.length && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-3">
            Quick Add - Standard Terms & Conditions:
          </h4>
          <div className="space-y-2">
            {defaultTerms.filter(term => !extraPoints.includes(term)).slice(0, 4).map((term, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addDefaultTerm(term)}
                className="w-full text-left px-3 py-2 text-sm bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">+</span> {term.substring(0, 100)}{term.length > 100 ? '...' : ''}
              </button>
            ))}
            {defaultTerms.filter(term => !extraPoints.includes(term)).length > 4 && (
              <button
                type="button"
                onClick={loadAllDefaultTerms}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                + Add All Remaining Terms ({defaultTerms.filter(term => !extraPoints.includes(term)).length - 4} more)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Current Terms List */}
      {extraPoints.length > 0 && (
        <div className="space-y-3">
          {extraPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                {index + 1}
              </div>
              <textarea
                value={point}
                onChange={(e) => updateExtraPoint(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
              />
              <button
                type="button"
                onClick={() => removeExtraPoint(index)}
                className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {extraPoints.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No terms and conditions added yet.</p>
          <p className="text-sm">Add standard terms or create custom conditions above.</p>
        </div>
      )}
    </section>
  );
};

export default ExtraPointsList;