// app/dashboard/layout.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/hooks/useUser'; // Import our new hook

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useUser(); // Get the current user's data

  const handleLogout = async () => {
    // ... (handleLogout function remains the same)
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success("You have been logged out.");
      router.push('/login');
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const renderNavLinks = () => {
    if (!user) return null; // Or show a loading skeleton

    if (user.role === 'influencer') {
      return (
        <>
          <Link href="/dashboard/influencer" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Dashboard
          </Link>
          <Link href="/dashboard/influencer/campaigns" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Campaigns
          </Link>
          <Link href="/dashboard/influencer/my-campaigns" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
           My Campaigns
          </Link>
          <Link href="/dashboard/influencer/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Profile
          </Link>
        </>
      );
    }

    if (user.role === 'brand') {
      return (
        <>
          <Link href="/dashboard/brand" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Dashboard
          </Link>
          {/* We can add more brand-specific links here later */}
        </>
      );
    }
    if (user.role === 'admin') {
      return (
        <>
          <Link href="/dashboard/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Dashboard
          </Link>
          <Link href="/dashboard/admin/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Users
          </Link>
          <Link href="/dashboard/admin/campaigns" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-lavender">
            Campaigns
          </Link>
        </>
      );
    }
    // Add admin links here later
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-heading text-blueberry">Fynxx</h2>
        </div>
        <nav className="mt-6 flex-grow">
          {isLoading ? <p className="p-4">Loading...</p> : renderNavLinks()}
        </nav>
        <div className="p-4 mt-auto">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}