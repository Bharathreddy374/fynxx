// app/dashboard/influencer/my-campaigns/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/influencer/applications');
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load your campaigns.");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (isLoading) return <p>Loading your campaigns...</p>;

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">My Campaigns</h1>
      {applications.length === 0 ? (
        <p>You have not applied to any campaigns yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <CampaignCard key={app._id} application={app} onProofSubmitted={fetchApplications} />
          ))}
        </div>
      )}
    </div>
  );
}

// A sub-component to handle the logic for each campaign card
function CampaignCard({ application, onProofSubmitted }: { application: Application, onProofSubmitted: () => void }) {
    const [proofLink, setProofLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProofSubmit = async () => {
        if (!proofLink) {
            toast.error("Please enter a link.");
            return;
        }
        setIsSubmitting(true);
        toast.loading("Submitting proof...");

        const res = await fetch(`/api/applications/${application._id}/proof`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: proofLink }),
        });

        const data = await res.json();
        if (res.ok) {
            toast.success("Proof submitted successfully!");
            onProofSubmitted(); // Refresh the list of applications
        } else {
            toast.error("Submission failed", { description: data.error });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{application.campaignId.title}</CardTitle>
                <CardDescription>
                    Status: 
                    <span className={`capitalize font-bold ml-2 ${
                        application.state === 'accepted' ? 'text-green-600' :
                        application.state === 'submitted' ? 'text-blue-600' :
                        'text-gray-600'
                    }`}>
                        {application.state}
                    </span>
                </CardDescription>
            </CardHeader>
            {application.state === 'accepted' && (
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor={`proof-${application._id}`}>Proof of Work Link</Label>
                        <Input id={`proof-${application._id}`} value={proofLink} onChange={(e) => setProofLink(e.target.value)} placeholder="https://instagram.com/p/..." />
                    </div>
                </CardContent>
            )}
            <CardFooter>
                {application.state === 'accepted' && (
                    <Button onClick={handleProofSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Proof'}
                    </Button>
                )}
                {application.state === 'submitted' && (
                    <p className="text-sm text-gray-600">Proof submitted for review. Link: <a href={application.proof?.link} target="_blank" rel="noopener noreferrer" className="underline">{application.proof?.link}</a></p>
                )}
            </CardFooter>
        </Card>
    )
}