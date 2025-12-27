import { Metadata } from "next";
import { GuestMenuPreviewContent } from "./_contents/content";

export const metadata: Metadata = {
  title: "Guest Menu Preview | Smart Restaurant",
  description: "Preview how your menu appears to guests",
};

export default function GuestMenuPreviewPage() {
  return <GuestMenuPreviewContent />;
}
