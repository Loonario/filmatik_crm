import type { Metadata } from "next";
// import { SidebarProvider } from "@/components/ui/sidebar"
import { Providers } from './providers'
// import { SidebarGlobalComponent } from '@/components/global/sidebarGlobal'
//import localFont from "next/font/local";
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Filmatik CRM",
  description: "Manage pre-production with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Providers>{children}</Providers>
      {/* <SidebarProvider open={false} defaultOpen={false}>
        <div className="flex h-screen overflow-hidden w-full">
          <SidebarGlobalComponent />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
        </SidebarProvider> */}
      </body>
    </html>
  )
}
