"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { EthProvider } from "@/contexts/EthContext";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />
        <body>
          <EthProvider>
            <ThemeProvider>
              {children}

            </ThemeProvider>
          </EthProvider>
        </body>
      </html>
    </>
  );
}
