import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorCard({ 
  title = 'Terjadi Kesalahan', 
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
  retryText = 'Coba Lagi'
}: ErrorCardProps) {
  return (
    <Card className="border-red-500/20 bg-red-500/5">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 max-w-md">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface LoadingCardProps {
  message?: string;
}

export function LoadingCard({ message = 'Memuat data...' }: LoadingCardProps) {
  return (
    <Card className="border-slate-700/20 bg-slate-800/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-slate-400">{message}</p>
      </CardContent>
    </Card>
  );
}

interface EmptyStateCardProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyStateCard({ 
  title = 'Tidak Ada Data', 
  message = 'Belum ada data yang tersedia.',
  icon
}: EmptyStateCardProps) {
  return (
    <Card className="border-slate-700/20 bg-slate-800/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon || <div className="w-12 h-12 rounded-full bg-slate-700 mb-4"></div>}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 max-w-md">{message}</p>
      </CardContent>
    </Card>
  );
}
