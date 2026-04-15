import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Industry standard font
import "./globals.css";

// Configure the font
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Everything inside 'children' is the content of your page.tsx files */}
        {children}
      </body>
    </html>
  );
}