export const LEVELS = {
  foundation: {
    id: "foundation",
    name: "CA Foundation",
    description: "Entry-level course for CA aspirants",
    icon: "🎯",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  intermediate: {
    id: "intermediate",
    name: "CA Intermediate",
    description: "Intermediate level for advanced preparation",
    icon: "📈",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  final: {
    id: "final",
    name: "CA Final",
    description: "Final level for comprehensive mastery",
    icon: "🏆",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
};

export const PAYMENT_METHODS = [
  { id: "upi", name: "UPI", icon: "📱" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "🏦" },
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "wallet", name: "Digital Wallet", icon: "👛" },
];

export const QUESTION_TYPES = [
  { id: "MCQ", name: "Objective (MCQ)", icon: "📝" },
  { id: "SUBJECTIVE", name: "Subjective", icon: "✍️" },
];

export const PAYMENT_STATUS = {
  pending: { label: "Pending", color: "text-yellow-700 bg-yellow-100" },
  approved: { label: "Approved", color: "text-green-700 bg-green-100" },
  rejected: { label: "Rejected", color: "text-red-700 bg-red-100" },
};

export const UPI_CONFIG = {
  id: "6203793113@kotak811",
  name: "CA Quest Payment",
};
