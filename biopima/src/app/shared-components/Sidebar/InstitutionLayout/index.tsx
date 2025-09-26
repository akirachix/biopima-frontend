

'use client';
import Sidebar from "../Institution"; 

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
    
      <aside className="flex-shrink-0 w-[350px] bg-white shadow-sm">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}