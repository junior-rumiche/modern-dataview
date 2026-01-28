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
  metadataBase: new URL('https://modern-dataview.vercel.app'),
  title: "Modern DataView | The Fastest Online CSV & Excel Viewer",
  description: "Open, view, and analyze large CSV and Excel files instantly in your browser. 100% Private, no server uploads. The best tool for data analysis.",
  keywords: [
    "Online CSV Viewer", "Excel Viewer Online", "Free CSV Editor", "Open CSV File",
    "Large CSV Viewer", "XLSX Viewer", "Secure CSV Viewer", "Browser-based Spreadsheet Viewer",
    "CSV to Excel Converter", "Filter CSV Data", "No Upload Data Viewer", "Fast CSV Parser",
    "Google Sheets alternative", "View Large Excel Files", "Private Data Analysis"
  ],
  verification: {
    google: "0vDxt0U570AAai5uQjBWLTmgrNOM_5RQn8NVDq3ZcIE",
  },
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
