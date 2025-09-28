import React from 'react';
import Sidebar from "../Institution";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="fixed top-0 left-0 bottom-0 w-56 bg-white shadow-lg z-10 overflow-hidden">
        <Sidebar />
      </aside>
      
      <main className="ml-56 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
