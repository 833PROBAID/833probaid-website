import { Suspense } from "react";
import InvoiceForm from "../../components/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceForm />
    </Suspense>
  );
}
