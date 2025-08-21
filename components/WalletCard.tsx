// components/WalletCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletCardProps {
  balance: number;
}

export default function WalletCard({ balance }: WalletCardProps) {
  return (
    <Card className="w-full max-w-md animate-float glass-card bg-gradient-to-tr from-blueberry to-purple-400 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-subheading tracking-wider">
          Your Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-heading font-bold">
          ₹{balance.toLocaleString('en-IN')}
        </p>
        <p className="text-sm opacity-80 mt-2">
          Ready to withdraw
        </p>
      </CardContent>
    </Card>
  );
}