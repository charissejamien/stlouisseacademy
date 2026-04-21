import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google"; // Industry standard font
import { Montserrat, EB_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


// Configure the font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  // Montserrat has many weights, pick only what you need to keep the site fast
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat", // This creates a CSS variable
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // 400 is normal, 700 is bold
  variable: "--font-garamond",
  display: "swap",
});

// This metadata handles SEO and the text shown in the browser tab
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
    <html lang="en" className={cn("font-sans", inter.variable, montserrat.variable, ebGaramond.variable)}>
      <body className={`${poppins.className} antialiased`}>
        <div className={montserrat.className}>
          <Header />
        </div>
        {/* Everything inside 'children' is the content of your page.tsx files */}
        {children}
        <div className={montserrat.className}>
          <Footer />
        </div>
      </body>
    </html>
  );
}