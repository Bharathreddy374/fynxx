// app/dashboard/admin/proofs/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface SubmittedProof {
  _id: string;
  state: string;
  proof: {
    link: string;
    status: string;
  };
  influencerId: {
    name: string;
  };
  campaignId: {
    title: string;
    rewardAmount: number;
  };
}

export default function AdminProofReviewPage() {
  const [submissions, setSubmissions] = useState<SubmittedProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/proofs');
      if (!res.ok) throw new Error('Failed to fetch proofs or you are not an admin.');
      const data = await res.json();
      setSubmissions(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Error", { description: "Unknown error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApproveProof = async (applicationId: string) => {
    setApprovingId(applicationId);
    toast.loading("Approving proof and crediting wallet...");

    try {
        const res = await fetch(`/api/admin/proofs/${applicationId}/approve`, {
            method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to approve proof.");

        toast.success("Proof approved!", { description: "The influencer's wallet has been credited."});
        // Refresh the list to remove the approved item
        fetchSubmissions();

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Approval Failed", { description: error.message });
      } else {
        toast.error("Approval Failed", { description: "Unknown error occurred" });
      }
    } finally {
        setApprovingId(null);
    }
  };

  if (isLoading) return <p>Loading submitted proofs...</p>;

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">Proof Submissions</h1>
      {submissions.length === 0 ? (
        <p>There are no proofs awaiting review.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map(app => (
            <Card key={app._id}>
              <CardHeader>
                <CardTitle>Campaign: {app.campaignId.title}</CardTitle>
                <CardDescription>Influencer: {app.influencerId.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  <strong>Reward:</strong> ₹{app.campaignId.rewardAmount}
                </p>
                <Link href={app.proof.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">View Proof</Button>
                </Link>
              </CardContent>
              <CardContent className="flex justify-end gap-2">
                <Button variant="destructive" size="sm" disabled={approvingId === app._id}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => handleApproveProof(app._id)} disabled={approvingId === app._id}>
                  {approvingId === app._id ? 'Approving...' : 'Approve & Pay'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}