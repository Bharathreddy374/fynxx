// app/dashboard/admin/users/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users or you are not an admin.');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserApproval = async (userId: string, decision: 'approved' | 'rejected') => {
    setUpdatingId(userId);
    toast.loading("Updating user status...");

    try {
        const res = await fetch('/api/admin/users/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, decision }),
        });

        const updatedUser = await res.json();
        if (!res.ok) throw new Error(updatedUser.error || 'Failed to update status');

        toast.success(`User has been ${decision}.`);

        // Update the UI instantly
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user._id === userId ? { ...user, status: updatedUser.status } : user
            )
        );

    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error("Update Failed", { description: error.message });
        } else {
            toast.error("Update Failed", { description: "Unknown error occurred" });
        }
    } finally {
        setUpdatingId(null);
    }
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-3xl font-heading text-slate-800 mb-6">User Management</h1>
      <div className="space-y-4">
        {users.map(user => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
                <p><strong>Status:</strong> <span className="capitalize font-bold">{user.status}</span></p>
              </div>
              {user.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleUserApproval(user._id, 'rejected')} disabled={updatingId === user._id}>
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleUserApproval(user._id, 'approved')} disabled={updatingId === user._id}>
                    Approve
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}