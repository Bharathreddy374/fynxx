// app/dashboard/brand/campaigns/[id]/applicants/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface Applicant {
  _id: string;
  influencerId: {
    _id: string;
    name: string;
    email: string;
  };
  state: string;
}

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const campaignId = params.id;

  useEffect(() => {
    if (!campaignId) return;
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`/api/brand/campaigns/${campaignId}/applications`);
        if (!res.ok) throw new Error('Failed to fetch applicants');
        const data = await res.json();
        setApplicants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [campaignId]);

  const handleReview = async (applicationId: string, decision: 'accepted' | 'rejected') => {
    setReviewingId(applicationId);
    toast.loading(`Updating application...`);

    try {
      const res = await fetch(`/api/applications/${applicationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });

      const updatedApplication = await res.json();
      if (!res.ok) throw new Error(updatedApplication.error || 'Failed to update status');

      toast.success(`Application has been ${decision}.`);

      // Update the UI instantly
      setApplicants(currentApplicants =>
        currentApplicants.map(app =>
          app._id === applicationId ? { ...app, state: updatedApplication.state } : app
        )
      );

    } catch (error: unknown) {
      toast.error("Update Failed", { description: (error as Error).message });
    } finally {
      setReviewingId(null);
    }
  };

  if (isLoading) {
    return <div>Loading applicants...</div>;
  }

  return (
    <div>
      <Link href="/dashboard/brand" className="text-sm font-medium hover:underline mb-4 inline-block">
        &larr; Back to Campaigns
      </Link>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">
        Campaign Applicants
      </h1>
      {applicants.length === 0 ? (
        <p>No one has applied to this campaign yet.</p>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <Card key={app._id}>
              <CardHeader>
                <CardTitle>{app.influencerId.name}</CardTitle>
                <CardDescription>{app.influencerId.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${
                    app.state === 'accepted' ? 'bg-green-200 text-green-800' 
                  : app.state === 'rejected' ? 'bg-red-200 text-red-800' 
                  : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {app.state}
                </span>
                <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleReview(app._id, 'rejected')}
                      disabled={reviewingId === app._id || app.state !== 'applied'}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleReview(app._id, 'accepted')}
                      disabled={reviewingId === app._id || app.state !== 'applied'}
                    >
                      Approve
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}