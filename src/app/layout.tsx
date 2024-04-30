import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { TopNav } from "~/_componetes/topnav";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "node_modules/uploadthing/server/index.cjs";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "T3Gallery",
  description: "Created by Theo - T3. gg on YouTube",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <body className="bg-gradient-to-r from-indigo-400 to-cyan-400">
          <TopNav />
          <div className={`font-sans ${inter.variable} grid p-4 text-white`}>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
