const WrongCashPayment = "wrongCashPayment";

export const ApplicationErrors = {
  WrongCashPayment,
};

export const AlertSeverity = {
  Error: "error",
  Warning: "warning",
  Info: "info",
};

const GiroTransfer = "giro";
const CashPayment = "cash";
const Deposit = "deposit";
const VAT = "vat";
const ReducedVAT = "reducedVat";

export const PurchaseCategories = {
  GiroTransfer,
  CashPayment,
  Deposit,
  VAT,
  ReducedVAT,
};

const TransactionCategories = [
  {
    id: 1,
    type: "payment",
  },
  {
    id: 2,
    type: "deposit",
  },
  {
    id: 3,
    type: "correction",
  },
  {
    id: 4,
    type: "percent19",
  },
  {
    id: 5,
    type: "percent7",
  },
  {
    id: 6,
    type: "paymentSepa",
  },
];

export const Stories = {
  TransactionCategories,
};
