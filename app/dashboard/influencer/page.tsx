// app/dashboard/influencer/page.tsx
"use client";

import { useEffect, useState } from "react";
import WalletCard from "@/components/WalletCard";
import { toast } from "sonner"; // Import toast for error handling

export default function InfluencerDashboard() {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch('/api/wallet');

        // --- ADD THIS CHECK ---
        if (!res.ok) {
          throw new Error("Could not fetch wallet balance.");
        }

        const data = await res.json();
        setBalance(data.balance);
      } catch (error: unknown) {
        toast.error("Error", { description: (error as Error).message });
        setBalance(0); // Set a default value on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Welcome, Influencer!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Show a loading state or the card */}
        {isLoading ? <p>Loading wallet...</p> : <WalletCard balance={balance ?? 0} />}
      </div>
    </div>
  );
}