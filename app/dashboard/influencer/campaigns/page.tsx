// app/dashboard/influencer/campaigns/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define a type for our campaign data for type safety
interface Campaign {
  _id: string;
  title: string;
  brief: string;
  rewardAmount: number;
  platform: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
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
              <Button className="w-full">View & Apply</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}