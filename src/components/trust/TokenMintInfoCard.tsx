import { useState } from 'react';
import { ExternalLink, Copy, Check, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TPC_TOKEN, truncateMintAddress, copyToClipboard } from '@/constants/tpcToken';

interface TokenMintInfoCardProps {
  compact?: boolean;
  showExplorer?: boolean;
  showDisclaimer?: boolean;
  className?: string;
  lang?: 'id' | 'en';
}

// i18n translations
const translations = {
  id: {
    officialToken: 'Token Resmi TPC',
    network: 'Jaringan',
    mintAddress: 'Alamat Mint',
    explorer: 'Explorer',
    copy: 'Salin',
    copied: 'Tersalin!',
    presaleBadge: 'Presale / Private Distribution',
    disclaimer: {
      title: 'Penting:',
      content: 'Status "Not Trusted" di explorer adalah normal untuk token presale yang belum listing publik. Metadata & authority akan dikunci sesuai roadmap.'
    },
    officialMint: 'Official TPC Token',
    notTrustedNote: 'TPC dikirim menggunakan token resmi berikut:'
  },
  en: {
    officialToken: 'Official TPC Token',
    network: 'Network',
    mintAddress: 'Token Mint Address',
    explorer: 'Explorer',
    copy: 'Copy',
    copied: 'Copied!',
    presaleBadge: 'Presale / Private Distribution',
    disclaimer: {
      title: 'Important:',
      content: 'Status "Not Trusted" in explorer is normal for presale tokens not yet publicly listed. Metadata & authority will be locked according to roadmap.'
    },
    officialMint: 'Official TPC Token',
    notTrustedNote: 'TPC sent using the following official token:'
  }
};

export default function TokenMintInfoCard({ 
  compact = false, 
  showExplorer = true, 
  showDisclaimer = true,
  className = "",
  lang = 'id'
}: TokenMintInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleCopy = async () => {
    const success = await copyToClipboard(TPC_TOKEN.mint);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className={`bg-[#1E2329]/50 backdrop-blur-sm border border-[#2B3139] rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#F0B90B]" />
            <div>
              <div className="text-white font-medium text-sm">{t.officialToken}</div>
              <div className="text-[#848E9C] text-xs font-mono">
                {truncateMintAddress(TPC_TOKEN.mint)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-[#848E9C] hover:text-white h-6 px-2"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            {showExplorer && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#F0B90B] hover:text-[#F8D56B] h-6 px-2"
              >
                <a
                  href={TPC_TOKEN.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-[#11161C]/50 backdrop-blur-xl border border-[#1F2A33] rounded-2xl overflow-hidden ${className}`}>
      <CardHeader className="bg-[#1A1B22]/50 border-b border-[#1F2A33]">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#F0B90B]" />
          <CardTitle className="text-white text-lg">{t.officialToken}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Network */}
        <div className="flex items-center justify-between">
          <span className="text-[#848E9C] text-sm">{t.network}</span>
          <span className="text-white font-medium">{TPC_TOKEN.network}</span>
        </div>

        {/* Token Mint Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#848E9C] text-sm">{t.mintAddress}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-[#F0B90B] hover:text-[#F8D56B] h-6 px-2"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  {t.copy}
                </>
              )}
            </Button>
          </div>
          <div className="bg-[#1E2329] rounded-lg p-3">
            <code className="text-[#F0B90B] font-mono text-sm break-all">
              {TPC_TOKEN.mint}
            </code>
          </div>
        </div>

        {/* Explorer Link */}
        {showExplorer && (
          <div className="flex items-center justify-between">
            <span className="text-[#848E9C] text-sm">{t.explorer}</span>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-[#1A1B22]"
            >
              <a
                href={TPC_TOKEN.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Solscan
              </a>
            </Button>
          </div>
        )}

        {/* Badge */}
        <div className="flex justify-center pt-2">
          <Badge className="bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/50">
            {t.presaleBadge}
          </Badge>
        </div>

        {/* Disclaimer */}
        {showDisclaimer && (
          <Alert className="bg-[#F0B90B]/10 border-[#F0B90B]/30">
            <Info className="h-4 w-4 text-[#F0B90B]" />
            <AlertDescription className="text-[#F0B90B] text-sm">
              <strong>{t.disclaimer.title}</strong> {t.disclaimer.content}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
