import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrentPricing, calculateTPCFromUSD, calculateSponsorBonus, formatCurrency } from '@/config/pricing';
import { Coins, TrendingUp, Clock, Gift } from 'lucide-react';

export function PricingCard() {
  const pricing = getCurrentPricing();
  
  const examplePurchase = calculateTPCFromUSD(100); // Example $100 purchase
  const sponsorBonus = calculateSponsorBonus(examplePurchase.total_amount);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="h-6 w-6 text-primary" />
          <Badge variant="default" className="bg-primary">
            {pricing.name}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold">
          {formatCurrency(pricing.price_usd, 'USD')}
        </CardTitle>
        <p className="text-muted-foreground">per TPC Token</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Kurs Info */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">Kurs USD/IDR</span>
          <span className="font-semibold">1:{pricing.kurs_idr.toLocaleString('id-ID')}</span>
        </div>
        
        {/* Bonus Info */}
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Gift className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Bonus {pricing.sponsor_bonus_percentage}% TPC untuk Sponsor
          </span>
        </div>
        
        {/* Example Calculation */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Contoh Pembelian $100
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base TPC:</span>
              <span className="font-mono">{examplePurchase.base_amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Bonus untuk Sponsor:</span>
              <span className="font-mono">+{sponsorBonus.bonus_amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              💰 Bonus diberikan kepada sponsor, bukan pembeli
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total TPC:</span>
              <span className="font-mono text-primary">{examplePurchase.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        {/* Time Info */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <div>Periode: {pricing.start_date} - {pricing.end_date}</div>
            <div>Min: {formatCurrency(pricing.min_purchase_usd, 'USD')} - Max: {formatCurrency(pricing.max_purchase_usd, 'USD')}</div>
          </div>
        </div>
        
        <Button className="w-full btn-gold" size="lg">
          Beli TPC Sekarang
        </Button>
      </CardContent>
    </Card>
  );
}
