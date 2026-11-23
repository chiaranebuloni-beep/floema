import type { Metadata } from "next";
import { CheckoutForm } from "@/components/pages/CheckoutForm";
import { paymentsEnabled } from "@/lib/stripe";

export const metadata: Metadata = { title: "Checkout — FLOEMA Wood Studio", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  return (
    <main>
      <CheckoutForm stripe={await paymentsEnabled()} />
    </main>
  );
}
