export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout min-h-dvh w-full bg-[#0f1117] text-white">
      {children}
    </div>
  );
}
