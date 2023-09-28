import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "components/providers/modal-provider";
import { QueryProvider } from "components/providers/query-provider";
import { ThemeProvider } from "components/providers/theme-provider";
import { cn } from "lib/utils";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
  description:
    "Discord is the easiest way to communicate over voice, video, and text. Chat, hang out, and stay close with your friends and communities."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="discord-theme"
        >
          <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
