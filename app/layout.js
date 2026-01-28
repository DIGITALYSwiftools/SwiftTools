"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Roboto } from 'next/font/google';
import { Toaster } from "react-hot-toast";
const roboto = Roboto({
  weight: ['100','400','700','900'], // pick the weights you need
  style: ['normal', 'italic'],       // optional
  subsets: ['latin'],                // optional: add 'latin-ext' if needed
  display: 'swap',                   // improves loading
});

// export const metadata = {
//   title: "SwiftTools",
//   description: "The all-in-one toolbox that fits your daily workflow.",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       className={roboto.className}
      >
          <Toaster />
          <SessionProvider>  {children} </SessionProvider>
      
      </body>
    </html>
  );
}
