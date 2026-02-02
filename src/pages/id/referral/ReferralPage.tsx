import { ReferralNetworkTable } from '@/components/ReferralNetworkTable';

export default function ReferralPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Jaringan Referral Saya</h1>
      <ReferralNetworkTable />
    </div>
  );
}
