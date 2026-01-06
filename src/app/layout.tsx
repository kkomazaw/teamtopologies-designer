import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Topologies Designer",
  description: "Design and visualize your organization structure using Team Topologies patterns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
