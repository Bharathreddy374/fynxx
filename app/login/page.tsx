// app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we just log the data. We'll send it to an API later.
    console.log({ email, password });
    alert("Check the console to see your form data!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lavender to-blueberry/20 p-4">
      <Card className="w-full max-w-sm glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center font-subheading">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Sign In</Button>
            <p className="text-sm text-center">
              Dont have an account?{" "}
              <Link href="/register" className="underline font-bold">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}