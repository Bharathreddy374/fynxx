// app/dashboard/admin/page.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/users">
          <Card className="hover:bg-gray-50">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Approve or reject new users.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/admin/campaigns">
          <Card className="hover:bg-gray-50">
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>View all platform campaigns.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}