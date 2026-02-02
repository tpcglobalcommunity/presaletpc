import { BarChart3, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminAnalyticsPage() {
  // Placeholder data - will be implemented with actual analytics
  const stats = {
    totalRevenue: 0,
    totalUsers: 0,
    totalInvoices: 0,
    conversionRate: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[#848E9C]">Analisis data dan statistik sistem</p>
        </div>
        <Badge className="bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">
          Coming Soon
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#F0B90B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0</div>
            <p className="text-[#848E9C] text-xs">Total pendapatan</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total Users</CardTitle>
            <Users className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-[#848E9C] text-xs">User terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-[#848E9C] text-xs">Invoice dibuat</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#848E9C]">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0%</div>
            <p className="text-[#848E9C] text-xs">Rate konversi</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#F0B90B]" />
              Revenue Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-[#2B3139]/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
                <p className="text-[#848E9C]">Revenue chart akan segera tersedia</p>
                <p className="text-[#848E9C] text-sm mt-1">Menampilkan grafik pendapatan per periode</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2329] border-[#2B3139]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#F0B90B]" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-[#2B3139]/30 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-[#848E9C] mx-auto mb-4" />
                <p className="text-[#848E9C]">User growth chart akan segera tersedia</p>
                <p className="text-[#848E9C] text-sm mt-1">Menampilkan pertumbuhan user per waktu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-gradient-to-br from-[#F0B90B]/10 to-[#F8D56B]/5 border-[#F0B90B]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#F0B90B]" />
            Fitur Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-white">
              Fitur analytics akan menyediakan insight mendalam tentang performa sistem:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Financial Analytics</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Revenue trends</li>
                  <li>• Payment methods breakdown</li>
                  <li>• Currency conversion rates</li>
                  <li>• Profit analysis</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">User Analytics</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• User acquisition</li>
                  <li>• Active users metrics</li>
                  <li>• Referral performance</li>
                  <li>• User retention</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Transaction Analytics</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• Invoice completion rates</li>
                  <li>• Processing times</li>
                  <li>• Status distribution</li>
                  <li>• Peak transaction times</li>
                </ul>
              </div>

              <div className="bg-[#1E2329]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-[#F0B90B]" />
                  <span className="text-white font-medium">Performance Metrics</span>
                </div>
                <ul className="text-[#848E9C] text-sm space-y-1">
                  <li>• System performance</li>
                  <li>• API response times</li>
                  <li>• Error rates</li>
                  <li>• Usage patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
