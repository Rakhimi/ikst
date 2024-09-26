import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import LoginModal from "@/components/Modal/LoginModal";
import RegisterModal from "@/components/Modal/RegisterModal";
import { ModalProvider } from "@/components/Modal/ModalContext";
import ToasterProvider from "@/components/ToasterProvider";
import Nav from "@/components/Navbar/Nav";
import getCurrentUser from "./actions/getCurrentUser";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IKST",
  description: "IKST",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const currentUser = getCurrentUser();



  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModalProvider>
        <ToasterProvider/>
        <RegisterModal/>
        <LoginModal/>
        <Nav currentUser={currentUser}/>
        {children}
        </ModalProvider>
      </body>
    </html>
  );
}
