import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ModalProvider } from "components/providers/modal-provider";
import { QueryProvider } from "components/providers/query-provider";
import { ThemeProvider } from "components/providers/theme-provider";
import { cn } from "lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ggSans = localFont({
  src: [
    {
      path: "../assets/fonts/gg-sans-regular.woff",
      weight: "400",
      style: "normal"
    },
    {
      path: "../assets/fonts/gg-sans-medium.woff",
      weight: "500",
      style: "normal"
    },
    {
      path: "../assets/fonts/gg-sans-semibold.woff",
      weight: "600",
      style: "normal"
    },
    {
      path: "../assets/fonts/gg-sans-bold.woff",
      weight: "700",
      style: "normal"
    }
  ]
});

export const metadata: Metadata = {
  title: "Discourse",
  description:
    "Discourse is the easiest way to communicate over voice, video, and text. Chat, hang out, and stay close with your friends and communities."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: ggSans.style.fontFamily,
          colorPrimary: "#F6565F"
        },
        baseTheme: dark,
        elements: {
          userButtonBox: "le",
          userButtonPopoverActionButton: "tracking-normal",
          userButtonPopoverFooter: "hidden",
          card: "bg-backgroundDark2",
          navbarButton: "tracking-normal"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(ggSans.className, "bg-backgroundDark tracking-normal")}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discourse-theme"
          >
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
