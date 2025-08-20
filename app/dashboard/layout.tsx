// app/dashboard/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-heading text-blueberry">Fynxx</h2>
        </div>
        <nav className="mt-6">
          {/* We will add real navigation links here later */}
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Dashboard
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Campaigns
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}