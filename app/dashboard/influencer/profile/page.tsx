// app/dashboard/influencer/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define a type for our user data
interface UserProfile {
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription>This is your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> <span className="capitalize">{profile.role}</span></p>
          <p><strong>Status:</strong> <span className="capitalize">{profile.status}</span></p>
        </CardContent>
      </Card>
    </div>
  );
}