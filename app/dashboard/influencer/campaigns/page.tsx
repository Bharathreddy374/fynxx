// app/dashboard/influencer/campaigns/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Update the Campaign interface
interface Campaign {
  _id: string;
  title: string;
  brief: string;
  rewardAmount: number;
  platform: string;
  hasApplied?: boolean; // Add the new optional property
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      // ... (fetchCampaigns function is the same)
      try {
        const res = await fetch('/api/campaigns');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCampaigns(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleApply = async (campaignId: string) => {
    setApplyingId(campaignId);
    toast.loading("Submitting your application...");

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/apply`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to apply");
      }

      toast.success("Successfully applied!");

      // --- UPDATE THE UI INSTANTLY ---
      // Find the campaign in the state and update its status
      setCampaigns(currentCampaigns => 
        currentCampaigns.map(c => 
          c._id === campaignId ? { ...c, hasApplied: true } : c
        )
      );

    // ... existing code ...
  } catch (error: unknown) {
    toast.error("Application Failed", {
      description: error instanceof Error ? error.message : "Unknown error occurred",
    });
// ... existing code ...
    } finally {
      setApplyingId(null);
    }
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Available Campaigns
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
              <CardDescription>Platform: {campaign.platform}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{campaign.brief}</p>
              <p className="mt-4 text-lg font-bold text-blueberry">
                Reward: ₹{campaign.rewardAmount.toLocaleString('en-IN')}
              </p>
            </CardContent>
            <CardFooter>
              {/* --- UPDATE THE BUTTON LOGIC --- */}
              <Button
                className="w-full"
                onClick={() => handleApply(campaign._id)}
                disabled={applyingId === campaign._id || campaign.hasApplied}
              >
                {campaign.hasApplied 
                  ? "Applied" 
                  : (applyingId === campaign._id ? "Applying..." : "View & Apply")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}