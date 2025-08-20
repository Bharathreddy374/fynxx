// app/dashboard/brand/campaigns/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("Creating campaign...");

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          brief, 
          rewardAmount: Number(rewardAmount), 
          platform 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create campaign");

      toast.success("Campaign created successfully!");
      router.push('/dashboard/brand'); // Redirect back to the brand dashboard

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Create a New Campaign
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Fill out the form below to launch your campaign.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Summer Skincare Promotion" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brief">Brief</Label>
              <Input id="brief" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe the campaign goals..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward">Reward Amount (₹)</Label>
              <Input id="reward" type="number" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} placeholder="e.g., 1000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select onValueChange={setPlatform} defaultValue={platform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}