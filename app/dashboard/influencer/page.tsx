// app/dashboard/influencer/page.tsx
import WalletCard from "@/components/WalletCard";

export default function InfluencerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Welcome, Influencer!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WalletCard />
        {/* We will add more dashboard components here */}
      </div>
    </div>
  );
}