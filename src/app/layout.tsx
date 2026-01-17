import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Modern DataView | The Fastest Online CSV & Excel Viewer",
  description: "Open, view, and analyze large CSV and Excel files instantly in your browser. 100% Private, no server uploads. The best tool for data analysis.",
  keywords: [
    "CSV Viewer", "Excel Viewer", "Online CSV Editor", "Free Online Excel Viewer",
    "CSV to Excel Converter", "Data Analysis Tool", "Large CSV Viewer",
    "Filter CSV Online", "No Upload CSV Viewer", "Secure Data Analysis",
    "JSON Viewer", "Big Data", "Google Sheets alternative"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
