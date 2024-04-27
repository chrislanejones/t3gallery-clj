import "~/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function TopNav() {
  return (
    <nav className="font-border grid grid-cols-4 justify-between justify-items-center border-b p-5 text-xl font-bold text-white">
      <div>Gallery</div>
      <div></div>
      <div></div>
      <div>Sign In</div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-indigo-400 to-cyan-400">
        <TopNav />
        <div className={`font-sans ${inter.variable} grid p-4 text-white`}>
          {children}
        </div>
      </body>
    </html>
  );
}
