"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { homeLink, navDirectLinks, navSections } from "@/lib/navigation";

/**
 * Mobile navigation panel. The only interactive island in the header — the desktop
 * dropdowns are CSS-driven so they work without JavaScript.
 *
 * Sections are shown fully expanded rather than as nested accordions: most residents reach
 * this site on a phone (prd.md §8), and one scroll through a flat list beats hunting for
 * the right disclosure toggle.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[0.9375rem] font-semibold text-white"
      >
        {isOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        {isOpen ? "Close menu" : "Menu"}
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-white/15 bg-[var(--gov-navy-800)] pb-4"
        >
          <Link
            href={homeLink.href}
            className="block border-b border-white/10 px-4 py-3 text-[0.9375rem] font-semibold text-white"
          >
            {homeLink.label}
          </Link>

          {navSections.map((section) => (
            <div key={section.href} className="border-b border-white/10 px-4 py-3">
              <Link href={section.href} className="block text-[0.9375rem] font-semibold text-white">
                {section.label}
                <span lang="mr" className="ml-2 text-[0.8125rem] font-normal text-[var(--zari-gold-400)]">
                  {section.labelMr}
                </span>
              </Link>
              <ul className="mt-2.5 space-y-2 border-l-2 border-[var(--zari-gold-500)]/60 pl-3">
                {section.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="block text-sm text-slate-200">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {navDirectLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border-b border-white/10 px-4 py-3 text-[0.9375rem] font-semibold text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
