import { redirect } from "next/navigation";

// Con un solo prodotto la pagina prodotto coincide con lo shop.
export default function ProductPage() {
  redirect("/shop");
}
