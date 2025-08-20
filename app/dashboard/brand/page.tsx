// app/dashboard/brand/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BrandDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Brand Dashboard
      </h1>
      <p className="mb-4">Manage your campaigns and view analytics.</p>
      <Link href="/dashboard/brand/campaigns/create">
        <Button>Create New Campaign</Button>
      </Link>
    </div>
  );
}