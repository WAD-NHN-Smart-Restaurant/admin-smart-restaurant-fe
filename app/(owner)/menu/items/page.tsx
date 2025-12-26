import { Suspense } from "react";
import { Metadata } from "next";
import { Content } from "./_contents/content";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";

export const metadata: Metadata = {
  title: "Menu Items - Restaurant Admin",
  description: "Manage your restaurant's menu items, pricing, and photos",
};

export default function MenuItemsPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}
