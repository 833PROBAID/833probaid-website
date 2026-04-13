import TestPageClient from "./TestPageClient";

export const revalidate = 3600;

export default function TestPage() {
  return <TestPageClient />;
}
