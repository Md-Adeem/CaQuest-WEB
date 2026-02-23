import React, { useState } from "react";
import { PAYMENT_METHODS, UPI_CONFIG } from "../../../shared/utils/constants";
import { formatCurrency } from "../../../shared/utils/helpers";

const PaymentForm = ({ plan, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    transactionId: "",
    paymentMethod: "upi",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [transactionError, setTransactionError] = useState("");

  const handleUPIPayment = () => {
    // Construct UPI payment URL
    const upiId = UPI_CONFIG.id;
    const amount = plan.price;
    const name = UPI_CONFIG.name;
    const desc = `${plan.name} - ${plan.durationLabel}`;

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&tn=${encodeURIComponent(desc)}`;

    // Try to open the UPI app
    window.open(upiUrl, "_blank");

    // Show a message to the user
    alert(
      "Opening UPI app. Please complete the payment and return to enter the transaction ID."
    );
  };

  const validateTransactionId = (transactionId) => {
    if (!transactionId) return "";

    const trimmedId = transactionId.trim();

    // Length check
    if (trimmedId.length < 8 || trimmedId.length > 50) {
      return "Transaction ID must be between 8 and 50 characters";
    }

    // UPI Transaction ID patterns
    const upiPatterns = [
      /^[A-Z0-9]{12,20}$/, // Alphanumeric UPI IDs
      /^[0-9]{12,20}$/, // Numeric UPI IDs
      /^[A-Z]{2}[0-9]{10,18}$/, // Bank-specific patterns
      /^[0-9]{4}[A-Z]{4}[0-9]{4}$/, // Mixed pattern
      /^[A-Z]{4}[0-9]{8,12}$/, // Another common pattern
    ];

    // Bank reference ID patterns
    const bankPatterns = [
      /^[A-Z]{2}[0-9]{6,15}$/, // Bank codes + numbers
      /^[0-9]{6,20}$/, // Pure numeric references
      /^[A-Z0-9]{8,25}$/, // General alphanumeric
    ];

    const isValid = [...upiPatterns, ...bankPatterns].some((pattern) =>
      pattern.test(trimmedId.toUpperCase())
    );

    if (!isValid) {
      return "Invalid transaction ID format. Please enter a valid UPI transaction ID or bank reference number.";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate transaction ID in real-time
    if (name === "transactionId") {
      setTransactionError(validateTransactionId(value));
    }
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate transaction ID before submission
    const error = validateTransactionId(formData.transactionId);
    if (error) {
      setTransactionError(error);
      return;
    }

    const data = new FormData();
    data.append("subscriptionPlan", plan._id);
    data.append("transactionId", formData.transactionId);
    data.append("paymentMethod", formData.paymentMethod);
    data.append("amount", plan.price);
    if (screenshot) {
      data.append("screenshot", screenshot);
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

        {/* UPI Payment Option */}
        <div className="mb-4">
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              formData.paymentMethod === "upi"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={handleUPIPayment}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === "upi"}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-xl">📱</span>
            <span className="text-sm font-medium text-gray-700">UPI</span>
            <span className="ml-auto text-xs text-primary-600 font-medium">
              Click to Pay
            </span>
          </label>
        </div>

        {/* Coming Soon Banner for other methods */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">
                More Payment Options Coming Soon!
              </h4>
              <p className="text-sm text-gray-600">
                Bank Transfer • Credit/Debit Cards • Digital Wallets
              </p>
            </div>
            <div className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded-full">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">
          Payment Instructions
        </h4>
        <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
          <li>Click on the UPI payment option above to open your UPI app</li>
          <li>
            Complete the payment to our UPI ID: <strong>{UPI_CONFIG.id}</strong>
          </li>
          <li>Enter the UPI transaction ID below (12-20 characters)</li>
          <li>Upload a screenshot of the payment (optional)</li>
          <li>Admin will verify and approve your payment within 24 hours</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-700 font-medium mb-1">
            Valid Transaction ID Examples:
          </p>
          <div className="text-xs text-blue-600 grid grid-cols-1 md:grid-cols-3 gap-2">
            <span className="bg-blue-100 px-2 py-1 rounded">TXN1234567890</span>
            <span className="bg-blue-100 px-2 py-1 rounded">
              UPI123456789012
            </span>
            <span className="bg-blue-100 px-2 py-1 rounded">SB1234567890</span>
          </div>
        </div>
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
          className={`input-field ${
            transactionError ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder="Enter your transaction ID"
          required
        />
        {transactionError && (
          <p className="mt-1 text-sm text-red-600">{transactionError}</p>
        )}
        <div className="mt-2 text-xs text-gray-500">
          <p>Valid formats:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>UPI Transaction ID (12-20 alphanumeric characters)</li>
            <li>Bank Reference ID (8-25 alphanumeric characters)</li>
            <li>Example: TXN1234567890, UPI123456789012, SB1234567890</li>
          </ul>
        </div>
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
