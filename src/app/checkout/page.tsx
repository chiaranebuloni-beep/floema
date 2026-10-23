import type { Metadata } from "next";
import { CheckoutForm } from "@/components/pages/CheckoutForm";
import { stripeEnabled } from "@/lib/stripe";

export const metadata: Metadata = { title: "Checkout — FLOEMA Wood Studio", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutForm stripe={stripeEnabled()} />
    </main>
  );
}
