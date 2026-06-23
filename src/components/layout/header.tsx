"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-[#0A0A0A] shadow-lg shadow-black/50"
            : "bg-[#0A0A0A]/90 backdrop-blur-xl"
        } border-b border-[#333333]`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
              <div className="relative h-9 w-9 rounded-full bg-[#E31837] flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110 shrink-0">
                P
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  THE PITSTOP
                </span>
                <span className="block text-[9px] font-semibold text-[#E31837] tracking-[0.25em] uppercase">
                  Detailing
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative group ${
                      isActive
                        ? "text-white bg-white/5"
                        : "text-[#A0A0A0] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#E31837] transition-all duration-300 ${
                        isActive ? "w-4/5" : "w-0 group-hover:w-4/5"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#E31837] transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{SITE_CONFIG.phone}</span>
              </a>
              <Link href="/booking">
                <Button size="sm">Book Now</Button>
              </Link>
            </div>

            {/* Mobile right side */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <Link href="/booking" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="text-xs px-3 h-8">
                  Book
                </Button>
              </Link>

              {/* Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="relative flex items-center justify-center w-10 h-10 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors"
                style={{ minWidth: "40px" }}
              >
                <div className="flex flex-col justify-center items-center gap-[5px] w-5 h-5">
                  <span
                    className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center ${
                      isOpen ? "rotate-45 translate-y-[7px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${
                      isOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 origin-center ${
                      isOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-down menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-[#0A0A0A] border-b border-[#333333] shadow-2xl"
            >
              <nav className="px-4 py-3">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg mb-1 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-[#E31837]/10 text-white border border-[#E31837]/30"
                          : "text-[#A0A0A0] hover:text-white hover:bg-[#141414]"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E31837] shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom CTA strip */}
              <div className="px-4 pb-4 pt-2 border-t border-[#333333] flex items-center gap-3">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#E31837] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="ml-auto"
                >
                  <Button size="sm">Book Now</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
