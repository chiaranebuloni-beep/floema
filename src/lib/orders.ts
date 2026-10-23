import "server-only";
import { randomBytes } from "crypto";
import { readCollection, writeCollection } from "./store";
import type { PricedLine } from "./types";

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  notes?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "demo";
  customer: Customer;
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  stripeSessionId?: string;
};

// Archivio ordini su file JSON: valido solo in locale, da sostituire con un database prima del lancio.
const COLLECTION = "orders";

export async function createOrder(data: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const orders = await readCollection<Order[]>(COLLECTION, []);
  const order: Order = { ...data, id: `FL-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`, createdAt: new Date().toISOString() };
  orders.push(order);
  await writeCollection(COLLECTION, orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readCollection<Order[]>(COLLECTION, [])).find((o) => o.id === id);
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const orders = await readCollection<Order[]>(COLLECTION, []);
  const i = orders.findIndex((o) => o.id === id);
  if (i < 0) return undefined;
  orders[i] = { ...orders[i], ...patch };
  await writeCollection(COLLECTION, orders);
  return orders[i];
}
