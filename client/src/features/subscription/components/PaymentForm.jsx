import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../../../shared/utils/constants';
import { formatCurrency } from '../../../shared/utils/helpers';

const PaymentForm = ({ plan, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    transactionId: '',
    paymentMethod: 'upi',
  });
  const [screenshot, setScreenshot] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('subscriptionPlan', plan._id);
    data.append('transactionId', formData.transactionId);
    data.append('paymentMethod', formData.paymentMethod);
    data.append('amount', plan.price);
    if (screenshot) {
      data.append('screenshot', screenshot);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
            <p className="text-sm text-gray-500">{plan.durationLabel}</p>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(plan.price)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.paymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.paymentMethod === method.id}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-xl">{method.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {method.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">
          Payment Instructions
        </h4>
        <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
          <li>Complete the payment using your preferred method</li>
          <li>Enter the transaction/reference ID below</li>
          <li>Upload a screenshot of the payment (optional)</li>
          <li>Admin will verify and approve your payment within 24 hours</li>
        </ol>
      </div>

      {/* Transaction ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transaction / Reference ID
        </label>
        <input
          type="text"
          name="transactionId"
          value={formData.transactionId}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your transaction ID"
          required
        />
      </div>

      {/* Screenshot Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Screenshot (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-700"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="screenshot"
                  type="file"
                  className="sr-only"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            {screenshot && (
              <p className="text-sm text-green-600 font-medium">
                ✓ {screenshot.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center py-3"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          `Submit Payment - ${formatCurrency(plan.price)}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;