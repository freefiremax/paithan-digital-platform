import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoticeTicker } from "@/components/layout/NoticeTicker";
import { FloatingChatbotWidget } from "@/components/chatbot/FloatingChatbotWidget";

/**
 * Shell for every public page: government utility strip, council identity, section
 * navigation, pinned-notice ticker, content, municipal footer.
 *
 * The admin panel at /admin deliberately does not inherit this shell — public and admin
 * chrome stay separate (rules.md §4).
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <NoticeTicker />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingChatbotWidget />
    </>
  );
}

