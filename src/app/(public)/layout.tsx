import type { Metadata } from "next";
import { Poppins, Inter, Montserrat, EB_Garamond } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import QueryProvider from "@/providers/query-provider";
import Header from "@/components/(public)/Header";
import Footer from '@/components/(public)/Footer';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

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
        <Header />
        <QueryProvider>
          {children}
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}