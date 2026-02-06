import { Helmet } from 'react-helmet-async';

export default function PublicMenuPage() {
  return (
    <>
      <Helmet>
        <title>Menu - TPC Global</title>
        <meta name="description" content="TPC Global Menu - Coming soon" />
      </Helmet>
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Menu</h1>
          <p className="text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </>
  );
}
