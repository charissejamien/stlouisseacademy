import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Montserrat, EB_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/(public)/Header";
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// Configure the font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat", 
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Louisse Academy | Portal",
  description: "Official Student and Parent Portal for St. Louisse Academy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={cn(
        inter.variable, 
        poppins.variable, 
        montserrat.variable, 
        ebGaramond.variable
      )}
    >
      <body className={`${poppins.className} antialiased`}>
        <Toaster position="top-center"/>
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}