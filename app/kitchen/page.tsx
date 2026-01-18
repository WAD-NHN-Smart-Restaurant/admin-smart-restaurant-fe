import { Metadata } from "next";
import { KitchenContent } from "./_contents/content";

export const metadata: Metadata = {
  title: "Kitchen Display System - Smart Restaurant",
  description: "Kitchen order management and preparation tracking",
};

export default function KitchenPage() {
  return <KitchenContent />;
}
