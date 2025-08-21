// app/dashboard/influencer/wallet/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import WalletCard from '@/components/WalletCard';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  subtype: string;
  amount: number;
  createdAt: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/wallet');
      if (!res.ok) throw new Error('Failed to fetch wallet data');
      const data = await res.json();
      setWalletData(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load wallet details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Submitting withdrawal request...");

    try {
        const res = await fetch('/api/wallet/withdrawals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Number(amount), upiId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        toast.success("Withdrawal request submitted!", {
            description: "It will be processed by an admin shortly."
        });
        setAmount('');
        setUpiId('');
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error("Request Failed", { description: error.message });
        } else {
            toast.error("Request Failed", { description: "Unknown error occurred" });
        }
    }
  };

  if (isLoading) return <p>Loading wallet...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading text-slate-800">My Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <WalletCard balance={walletData?.balance || 0} />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Withdrawals are processed within 3-5 business days.</CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdrawal}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@bank" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Request Payout</Button>
                </CardFooter>
            </form>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {walletData?.transactions.map(tx => (
                  <li key={tx._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold capitalize">{tx.subtype.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}