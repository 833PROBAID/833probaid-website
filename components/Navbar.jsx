"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && scrollY > 100) return true;
        if (prev && scrollY < 60) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-xl"
          : "bg-white/80 backdrop-blur-sm shadow-lg"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "py-2" : "py-4"
          }`}
        >
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <Image
                src="/images/footer-logo.png"
                alt="833PROBAID Logo"
                width={240}
                height={60}
                sizes="(max-width: 768px) 176px, (max-width: 1280px) 208px, 240px"
                priority
                style={{ height: 'auto' }}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "h-auto w-32 md:w-32 lg:w-40 xl:w-44"
                    : "h-auto w-44 md:w-40 lg:w-52 xl:w-60"
                }`}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/"
              className={`font-bold transition-all duration-300 ${
                isScrolled ? "text-xl lg:text-2xl" : "text-2xl lg:text-3xl"
              } ${
                pathname === "/"
                  ? "text-secondary"
                  : "text-primary hover:text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className={`font-bold transition-all duration-300 ${
                isScrolled ? "text-xl lg:text-2xl" : "text-2xl lg:text-3xl"
              } ${
                pathname.startsWith("/blogs")
                  ? "text-secondary"
                  : "text-primary hover:text-secondary"
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/videos"
              className={`font-bold transition-all duration-300 ${
                isScrolled ? "text-xl lg:text-2xl" : "text-2xl lg:text-3xl"
              } ${
                pathname.startsWith("/videos")
                  ? "text-secondary"
                  : "text-primary hover:text-secondary"
              }`}
            >
              Video
            </Link>
          </nav>

          {/* Social Icons and Phone Button - Desktop */}
          <div className="hidden items-center gap-3 sm:gap-4 md:flex lg:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:opacity-80 hover:scale-110"
            >
              <Image
                src="/icons/instagram.png"
                alt="Instagram"
                width={64}
                height={64}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
                    : "h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16"
                }`}
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:opacity-80 hover:scale-110"
            >
              <Image
                src="/icons/facebook.png"
                alt="Facebook"
                width={64}
                height={64}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
                    : "h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16"
                }`}
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:opacity-80 hover:scale-110"
            >
              <Image
                src="/icons/linkedin.png"
                alt="LinkedIn"
                width={64}
                height={64}
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12"
                    : "h-10 w-10 lg:h-14 lg:w-14 xl:h-16 xl:w-16"
                }`}
              />
            </a>
            <a
              href="tel:8337762243"
              className="transition-all duration-300 hover:opacity-90 hover:scale-110"
            >
              <Image
                src="/icons/phone-call.png"
                alt="Call (833) PROBAID 7762243"
                width={200}
                height={100}
                className={`w-auto transition-all duration-300 ${
                  isScrolled ? "h-8 lg:h-10 xl:h-12" : "h-10 lg:h-14 xl:h-16"
                }`}
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 md:hidden ${
              isScrolled ? "scale-90" : "scale-100"
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className={`text-primary font-bold transition-all duration-300 ${
                  isScrolled ? "h-7 w-7" : "h-8 w-8"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className={`text-primary font-bold transition-all duration-300 ${
                  isScrolled ? "h-7 w-7" : "h-8 w-8"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {(isMenuOpen || isClosing) && (
          <div
            className={`fixed top-0 left-0 z-50 h-screen w-full bg-white transition-all duration-300 md:hidden ${
              isClosing ? "animate-slideOut" : "animate-slideIn"
            }`}
          >
            {/* Header inside menu */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <Link href="/" onClick={() => toggleMenu()}>
                <Image
                  src="/images/footer-logo.png"
                  alt="833PROBAID Logo"
                  width={128}
                  height={32}
                  sizes="128px"
                  style={{ height: "auto" }}
                  className="h-auto w-32"
                />
              </Link>
              <button
                onClick={toggleMenu}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  className="text-primary h-8 w-8 font-bold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col space-y-6 p-8">
              <Link
                href="/"
                className={`text-xl font-bold transition-colors ${
                  pathname === "/"
                    ? "text-secondary"
                    : "text-primary hover:text-secondary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className={`text-xl font-bold transition-colors ${
                  pathname.startsWith("/blogs")
                    ? "text-secondary"
                    : "text-primary hover:text-secondary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                href="/videos"
                className={`text-xl font-bold transition-colors ${
                  pathname.startsWith("/videos")
                    ? "text-secondary"
                    : "text-primary hover:text-secondary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Video
              </Link>
            </nav>

            {/* Social Icons and Phone - Mobile */}
            <div className="mt-8 flex items-center justify-center space-x-6 border-t border-gray-200 pt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center transition-opacity hover:opacity-80"
              >
                <Image
                  src="/icons/instagram.png"
                  alt="Instagram"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center transition-opacity hover:opacity-80"
              >
                <Image
                  src="/icons/facebook.png"
                  alt="Facebook"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center transition-opacity hover:opacity-80"
              >
                <Image
                  src="/icons/linkedin.png"
                  alt="LinkedIn"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <a
                href="tel:8337762243"
                className="flex justify-center transition-opacity hover:opacity-90"
              >
                <Image
                  src="/icons/phone-call.png"
                  alt="Call (833) PROBAID 7762243"
                  width={200}
                  height={100} // Set intrinsic dimensions
                  style={{ width: "200px", height: "auto" }} // CSS override				  fill
                />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
