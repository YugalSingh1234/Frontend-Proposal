import React from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

const PaymentSchedule = ({ paymentItems, setPaymentItems }) => {
  const addPaymentItem = () => {
    setPaymentItems([...paymentItems, { title: '', percent: 0 }]);
  };

  const removePaymentItem = (index) => {
    if (paymentItems.length > 1) {
      setPaymentItems(paymentItems.filter((_, i) => i !== index));
    }
  };

  const updatePaymentItem = (index, field, value) => {
    const updated = paymentItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === 'percent' ? parseFloat(value) || 0 : value };
      }
      return item;
    });
    setPaymentItems(updated);
  };

  const totalPercent = paymentItems.reduce((sum, item) => sum + item.percent, 0);
  const isValidTotal = Math.abs(totalPercent - 100) < 0.01;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Payment Schedule</h3>
        <button
          type="button"
          onClick={addPaymentItem}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {paymentItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milestone {index + 1}
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updatePaymentItem(index, 'title', e.target.value)}
                placeholder="e.g., Along with Work order"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage
              </label>
              <input
                type="number"
                value={item.percent}
                onChange={(e) => updatePaymentItem(index, 'percent', e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {paymentItems.length > 1 && (
              <button
                type="button"
                onClick={() => removePaymentItem(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {/* Total Percentage Display */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Total Percentage:</span>
          </div>
          <div className={`text-lg font-semibold ${
            isValidTotal ? 'text-green-600' : totalPercent > 100 ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {totalPercent.toFixed(1)}%
          </div>
        </div>

        {!isValidTotal && (
          <div className={`p-3 rounded-md ${
            totalPercent > 100 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}>
            <p className="text-sm">
              {totalPercent > 100 
                ? `Percentages exceed 100% by ${(totalPercent - 100).toFixed(1)}%. Please adjust.`
                : `Percentages total ${totalPercent.toFixed(1)}%. Add ${(100 - totalPercent).toFixed(1)}% more to reach 100%.`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentSchedule;