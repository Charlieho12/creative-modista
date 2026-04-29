import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function MessengerButton() {
  return (
    <a
      href={siteConfig.facebookUrl}
      className="fixed bottom-5 left-5 z-40 hidden rounded-full bg-blush-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blush-400 md:inline-flex"
    >
      <MessageCircle className="mr-2" size={18} /> Message us
    </a>
  );
}
