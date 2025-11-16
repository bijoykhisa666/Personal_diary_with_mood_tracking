import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Providers } from "./provider"; 

export const metadata: Metadata = {
  title: "Personal Diary",
  description: "Diary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextTopLoader />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
