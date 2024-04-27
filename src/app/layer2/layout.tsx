export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="">Second Layout</h1>
      {children}
    </div>
  );
}
