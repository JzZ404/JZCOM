import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Notable } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

// Runs before hydration so an explicit saved theme applies with no flash.
// If nothing is saved, the CSS prefers-color-scheme rule in globals.css
// handles it — this script only needs to act on an explicit user choice.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// PLACEHOLDER typeface — approximates Joyce's hero reference. Swap for her
// real pick once confirmed.
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Just for the "JZ" nav logo — Notable only ships one weight (400).
const notable = Notable({
  variable: "--font-notable",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Joyce Zhou",
  description: "Design technologist working across UX/product design, AI, and robotics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // theme-init below sets data-theme before hydration on purpose — this
      // silences the expected server/client mismatch warning for it.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${notable.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <Nav />
        <main className="flex-1 pt-28">{children}</main>
        {/* Dark mode temporarily disabled — bring the toggle back with it. */}
        {/* <ThemeToggle /> */}
      </body>
    </html>
  );
}
