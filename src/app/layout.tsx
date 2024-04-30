import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { TopNav } from "~/_componetes/topnav";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

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
