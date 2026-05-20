import { Sidebar, Header } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Sidebar />
      <Header />
      <main className="pt-[52px] transition-all duration-300 lg:pl-[240px]">
        <div className="p-4 sm:p-5">{children}</div>
      </main>
    </div>
  );
}