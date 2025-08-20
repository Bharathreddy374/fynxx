// app/dashboard/brand/campaigns/[id]/applicants/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
                <span className="text-sm font-semibold capitalize px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full">
                  {app.state}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline">Reject</Button>
                    <Button>Approve</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}