export const DEFAULT_INVOICE_NUMBER = "INV-0001";

export const deriveNextInvoiceNumber = (lastInvoiceNumber) => {
  if (!lastInvoiceNumber || typeof lastInvoiceNumber !== "string") {
    return DEFAULT_INVOICE_NUMBER;
  }

  const match = lastInvoiceNumber.match(/(\d+)$/);
  if (!match || !match[1]) {
    return DEFAULT_INVOICE_NUMBER;
  }

  const numericPart = match[1];
  const prefix =
    lastInvoiceNumber.slice(0, lastInvoiceNumber.length - numericPart.length) ||
    "INV-";
  const width = Math.max(numericPart.length, 4);
  const numericValue = Number.parseInt(numericPart, 10);

  if (Number.isNaN(numericValue)) {
    return DEFAULT_INVOICE_NUMBER;
  }

  const nextValue = (numericValue + 1).toString().padStart(width, "0");
  return `${prefix}${nextValue}`;
};
