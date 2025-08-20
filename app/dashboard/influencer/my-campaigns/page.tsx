// app/dashboard/influencer/my-campaigns/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Application {
  _id: string;
  state: string;
  campaignId: {
    title: string;
    brief: string;
  };
  proof?: { link: string; status: string; };
}

export default function MyCampaignsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [proofLink, setProofLink] = useState('');

  useEffect(() => {
    // Fetch applications logic here...
  }, []);

  const handleProofSubmit = async (applicationId: string) => {
    toast.loading("Submitting proof...");
    const res = await fetch(`/api/applications/${applicationId}/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: proofLink }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Proof submitted successfully!");
      // Here you would refresh the applications list
    } else {
      toast.error("Submission failed", { description: data.error });
    }
  };

  // In a real component, you would fetch and map the applications.
  // This is a simplified example to show the proof submission UI.
  const exampleApplication: Application = { 
    _id: "REPLACE_WITH_REAL_ID", 
    state: 'accepted', 
    campaignId: { title: 'Example Campaign', brief: 'Do something amazing.'},
  };

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">My Campaigns</h1>
      <Card>
        <CardHeader>
          <CardTitle>{exampleApplication.campaignId.title}</CardTitle>
          <CardDescription>Status: <span className="capitalize font-bold">{exampleApplication.state}</span></CardDescription>
        </CardHeader>
        {exampleApplication.state === 'accepted' && (
          <CardContent>
            <div className="space-y-2">
              <label htmlFor="proof">Proof of Work Link</label>
              <Input id="proof" value={proofLink} onChange={(e) => setProofLink(e.target.value)} placeholder="https://instagram.com/p/..." />
            </div>
          </CardContent>
        )}
        <CardFooter>
          {exampleApplication.state === 'accepted' && (
            <Button onClick={() => handleProofSubmit(exampleApplication._id)}>Submit Proof</Button>
          )}
           {exampleApplication.state === 'submitted' && (
            <p className="text-sm text-gray-600">Proof submitted for review.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}