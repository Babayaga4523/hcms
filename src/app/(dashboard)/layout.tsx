import { Sidebar } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Sidebar />
      <main className="pt-[60px] transition-all duration-300 lg:pl-[260px]">
        <div className="p-4 sm:p-6 lg:p-6">{children}</div>
      </main>
    </div>
  );
}