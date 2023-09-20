import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "components/providers/theme-provider";
import { cn } from "lib/utils";
import { ModalProvider } from "components/providers/modal-provider";
import { SocketProvider } from "components/providers/socket-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
  description:
    "Discord is the easiest way to communicate over voice, video, and text. Chat, hang out, and stay close with your friends and communities."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <SocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              storageKey="discord-theme"
            >
              <ModalProvider />
              {children}
            </ThemeProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
