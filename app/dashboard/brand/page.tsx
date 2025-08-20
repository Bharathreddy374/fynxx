// app/dashboard/brand/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is the same Campaign interface from the influencer's page
interface Campaign {
  _id: string;
  title: string;
  brief: string;
}

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns'); // We can reuse the same endpoint
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading text-slate-800">
          Your Campaigns
        </h1>
        <Link href="/dashboard/brand/campaigns/create">
          <Button>Create New Campaign</Button>
        </Link>
      </div>

      {isLoading ? <p>Loading campaigns...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <Card key={campaign._id}>
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription>{campaign.brief}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/brand/campaigns/${campaign._id}/applicants`}>
                  <Button variant="outline" className="w-full">View Applicants</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}