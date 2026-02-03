import { useState } from 'react';
import { ExternalLink, Copy, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TPC_TOKEN, truncateMintAddress, copyToClipboard } from '@/constants/tpcToken';

interface TrustStripProps {
  className?: string;
}

export default function TrustStrip({ className = "" }: TrustStripProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(TPC_TOKEN.mint);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-[#1A1B22]/80 backdrop-blur-sm border-t border-[#2B3139] py-3 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#F0B90B]" />
              <span className="text-[#848E9C]">Official TPC Mint:</span>
              <code className="text-white font-mono text-xs bg-[#1E2329] px-2 py-1 rounded">
                {truncateMintAddress(TPC_TOKEN.mint, 6, 6)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-[#848E9C] hover:text-white h-6 px-2"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
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
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">Solscan</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
