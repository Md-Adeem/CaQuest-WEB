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
  const [showQR, setShowQR] = useState(false);
  const [upiUrlString, setUpiUrlString] = useState("");

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
    
    setUpiUrlString(upiUrl);

    // Check if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Redirect to UPI app deeply without opening blank tab
      window.location.href = upiUrl;
    } else {
      // Desktop: Instead of erroring or empty tab, show a QR code
      setShowQR(true);
    }
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
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{plan.durationLabel}</p>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(plan.price)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Payment Method
        </label>

        {/* UPI Payment Option */}
        <div className="mb-4">
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              formData.paymentMethod === "upi"
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">UPI</span>
            <span className="ml-auto text-xs text-primary-600 dark:text-primary-400 font-medium">
              Click to Pay / View QR
            </span>
          </label>
          
          {/* Desktop QR Code Display */}
          {showQR && formData.paymentMethod === 'upi' && upiUrlString && (
            <div className="mt-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center shadow-sm animate-fade-in text-center">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Scan with any UPI App (PhonePe, GPay, Paytm)</p>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrlString)}`} 
                alt="Scan to pay" 
                className="w-48 h-48 border rounded-lg shadow-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Paying to: {UPI_CONFIG.id}</p>
            </div>
          )}
        </div>

        {/* Coming Soon Banner for other methods */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">
                More Payment Options Coming Soon!
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Bank Transfer • Credit/Debit Cards • Digital Wallets
              </p>
            </div>
            <div className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-full">
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
          Payment Instructions
        </h4>
        <ol className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>Click on the UPI payment option above to open your UPI app</li>
          <li>
            Complete the payment to our UPI ID: <strong>{UPI_CONFIG.id}</strong>
          </li>
          <li>Enter the UPI transaction ID below (12-20 characters)</li>
          <li>Upload a screenshot of the payment (optional)</li>
          <li>Admin will verify and approve your payment within 24 hours</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/50">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">
            Valid Transaction ID Examples:
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-300 grid grid-cols-1 md:grid-cols-3 gap-2">
            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">TXN1234567890</span>
            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
              UPI123456789012
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">SB1234567890</span>
          </div>
        </div>
      </div>

      {/* Transaction ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p>Valid formats:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>UPI Transaction ID (12-20 alphanumeric characters)</li>
            <li>Bank Reference ID (8-25 alphanumeric characters)</li>
            <li>Example: TXN1234567890, UPI123456789012, SB1234567890</li>
          </ul>
        </div>
      </div>

      {/* Screenshot Upload (Coming Soon) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Payment Screenshot (Optional)
        </label>
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl p-6 mt-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white dark:bg-gray-800/40 backdrop-blur-[2px] z-10"></div>
          
          <div className="z-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-gray-800 dark:text-gray-100 font-medium mb-1">Screenshot Upload</h4>
            <div className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
              Coming Soon
            </div>
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
