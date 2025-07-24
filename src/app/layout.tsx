import Script from "next/script";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navigation-bar";
import Footer from "../components/footer";
import ClientOnlyGuard from "./ClientOnlyGuard";
import { ServiceWorkerUpdater } from "@/components/ui/service-worker-updater";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZXC[STREAM]",
  description: "Discover and track your favorite movies",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics Scripts */}
        {/*MINE */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BH33L5GK2T"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BH33L5GK2T');
            `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/disable-devtool@latest"
          strategy="beforeInteractive"
          disable-devtool-auto=""
        />
        {/*PONCHANG */}
        {/* <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZYNKYR6V87"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZYNKYR6V87');
            `,
          }}
        /> */}

        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="ZXC[STREAM]" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <div className="fixed z-[-1] inset-0 bg-background bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.3)_0%,_transparent_70%)] p-10"></div> */}
          <ClientOnlyGuard>
            <NavBar />
            {children}
            {modal}
            <ServiceWorkerUpdater />
            <Footer />
            <Toaster position="top-right" expand={false} duration={3000} />
          </ClientOnlyGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
