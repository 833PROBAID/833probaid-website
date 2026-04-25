import { Suspense } from "react";
import InvoiceForm from "../../components/InvoiceForm";

export default function EditInvoicePage() {
  return (
    <Suspense fallback={null}>
      <InvoiceForm />
    </Suspense>
  );
}
