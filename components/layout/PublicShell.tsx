import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoticeTicker } from "@/components/layout/NoticeTicker";
import { PaithanEntryIntro } from "@/components/intro/PaithanEntryIntro";
import { FloatingChatbotWidget } from "@/components/chatbot/FloatingChatbotWidget";

/** Shared municipal chrome for public pages and the staff sign-in page. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
      <div className="site-shell">
        <PaithanEntryIntro />
        <div aria-hidden="true" className="saree-frame saree-frame--left" />
        <div aria-hidden="true" className="saree-frame saree-frame--right" />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <NoticeTicker />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingChatbotWidget />
      </div>
  );
}

