import { Helmet } from 'react-helmet-async';

export default function MarketPage() {
  return (
    <>
      <Helmet>
        <title>Market - TPC Global</title>
        <meta name="description" content="TPC Global Market - Coming soon" />
      </Helmet>
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Market</h1>
          <p className="text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </>
  );
}
