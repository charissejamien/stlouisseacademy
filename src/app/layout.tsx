import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Industry standard font
import "./globals.css";

// Configure the font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {/* Everything inside 'children' is the content of your page.tsx files */}
        {children}
      </body>
    </html>
  );
}