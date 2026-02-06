import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Wallet, 
  Shield, 
  Copy, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Download,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function TutorialPhantomWalletPage() {
  const { lang = 'en' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const isID = lang === 'id';

  const t = {
    id: {
      title: 'Tutorial Membuat Wallet TPC via Phantom',
      subtitle: 'Panduan lengkap membuat wallet TPC dengan aman menggunakan Phantom Wallet',
      intro: {
        title: 'Apa itu Phantom Wallet?',
        description: 'Phantom Wallet adalah wallet cryptocurrency yang populer dan terpercaya, dirancang khusus untuk ekosistem Solana. Wallet ini digunakan untuk menyimpan, mengirim, dan menerima token seperti TPC (TPC Global) dengan aman.',
        features: [
          'Keamanan tingkat enterprise',
          'Support untuk Solana dan SPL tokens',
          'Tersedia untuk mobile dan desktop',
          'Interface yang user-friendly',
          'Backup dan recovery options'
        ]
      },
      why: {
        title: 'Kenapa Phantom Wallet untuk TPC?',
        description: 'TPC (TPC Global) adalah token yang berbasis Solana blockchain. Untuk menyimpan, membeli, dan melakukan transaksi TPC, Anda memerlukan wallet yang kompatibel dengan Solana seperti Phantom Wallet.'
      },
      steps: {
        step1: {
          title: 'Download Phantom Wallet',
          description: 'Unduh aplikasi Phantom Wallet dari website resmi atau app store di perangkat Anda. Pilih versi yang sesuai dengan perangkat (mobile atau desktop).'
        },
        step2: {
          title: 'Buat Wallet Baru',
          description: 'Buka aplikasi Phantom dan pilih "Create New Wallet". Ikuti instruksi untuk membuat wallet baru dari awal.'
        },
        step3: {
          title: 'Simpan Seed Phrase',
          description: 'Seed phrase adalah kunci recovery wallet Anda. Simpan di tempat yang sangat aman dan tidak pernah dibagikan ke siapa pun. Tulis di kertas atau gunakan password manager.'
        },
        step4: {
          title: 'Set Password & Biometric',
          description: 'Lindungi wallet Anda dengan password atau biometric (fingerprint/face ID) untuk keamanan tambahan.'
        },
        step5: {
          title: 'Dapatkan Alamat Wallet',
          description: 'Alamat wallet (Public Address) akan ditampilkan setelah wallet dibuat. Alamat ini digunakan untuk menerima TPC dan token lainnya.'
        },
        step6: {
          title: 'Copy Alamat Wallet',
          description: 'Salin alamat wallet Anda untuk digunakan saat membeli TPC. Pastikan alamat yang disalin benar.'
        },
        step7: {
          title: 'Menerima Token (Opsional)',
          description: 'Untuk menerima TPC, Anda perlu alamat wallet yang valid. Transaksi akan terlihat di wallet Phantom setelah dikonfirmasi.'
        },
        step8: {
          title: 'Verifikasi Address (Opsional)',
          description: 'Selalu periksa panjang dan format alamat wallet. Jangan pernah paste seed phrase di field address. Alamat wallet dimulai dengan "So" atau "5".'
        }
      },
      security: {
        title: '⚠️ Peringatan Keamanan Penting',
        items: [
          'Seed phrase adalah kunci utama wallet Anda. JANGAN PERNAH dibagikan ke siapa pun, termasuk admin TPC.',
          'Admin TPC tidak akan pernah minta seed phrase Anda. Hati-hati dengan penipuan yang meminta informasi sensitif.',
          'Gunakan hanya website resmi tpcglobal.io untuk semua transaksi.',
          'Simpan seed phrase di tempat yang aman dan offline (kertas, vault digital, password manager).',
          'Aktifkan two-factor authentication (2FA) jika tersedia.',
          'Periksa URL website dengan teliti sebelum memasukkan informasi sensitif.'
        ]
      },
      faq: {
        title: 'Pertanyaan Umum',
        items: [
          {
            q: 'Apa bedanya Public Address dan Seed Phrase?',
            a: 'Public Address adalah alamat wallet yang bisa dibagikan untuk menerima token. Seed Phrase adalah kunci rahasia untuk memulihkan akses ke wallet. Jangan pernah bagikan seed phrase!'
          },
          {
            q: 'Kalau seed phrase hilang, apa yang harus dilakukan?',
            a: 'Seed phrase yang hilang berarti akses ke wallet Anda hilang selamanya. Buat wallet baru dan pastikan menyimpan seed phrase baru dengan sangat aman.'
          },
          {
            q: 'Bisakah mengganti wallet address?',
            a: 'Tidak, alamat wallet tidak bisa diubah. Setelah dibuat, alamat akan permanen terkait dengan seed phrase. Untuk alamat baru, Anda perlu membuat wallet baru.'
          },
          {
            q: 'Kenapa harus menggunakan Phantom Wallet?',
            a: 'Phantom adalah wallet yang direkomendasikan untuk ekosistem Solana karena keamanannya, kemudahan penggunaan, dan dukungan komunitas yang luas.'
          }
        ]
      },
      cta: {
        buy: 'Beli TPC Sekarang',
        antiScam: 'Info Anti-Scam'
      },
      disclaimer: {
        text: 'Tutorial ini hanya untuk tujuan edukasi, bukan saran finansial. Investasi cryptocurrency memiliki risiko tinggi. Lakukan riset mandiri sebelum berinvestasi.',
        warning: 'Jangan bagikan seed phrase wallet Anda kepada siapa pun, termasuk admin TPC.'
      }
    },
    en: {
      title: 'How to Create a TPC Wallet with Phantom',
      subtitle: 'Complete guide to safely create a TPC wallet using Phantom Wallet',
      intro: {
        title: 'What is Phantom Wallet?',
        description: 'Phantom Wallet is a popular and trusted cryptocurrency wallet specifically designed for the Solana ecosystem. It\'s used to securely store, send, and receive tokens like TPC (TPC Global) on the Solana blockchain.',
        features: [
          'Enterprise-level security',
          'Support for Solana and SPL tokens',
          'Available on mobile and desktop',
          'User-friendly interface',
          'Backup and recovery options'
        ]
      },
      why: {
        title: 'Why Phantom Wallet for TPC?',
        description: 'TPC (TPC Global) is a token built on the Solana blockchain. To store, purchase, and transact TPC, you need a Solana-compatible wallet like Phantom Wallet.'
      },
      steps: {
        step1: {
          title: 'Download Phantom Wallet',
          description: 'Download Phantom Wallet from the official website or your device\'s app store. Choose the version that matches your device (mobile or desktop).'
        },
        step2: {
          title: 'Create New Wallet',
          description: 'Open the Phantom app and select "Create New Wallet". Follow the instructions to create a new wallet from scratch.'
        },
        step3: {
          title: 'Save Seed Phrase',
          description: 'Your seed phrase is the recovery key for your wallet. Save it in a very secure location and never share it with anyone. Write it down on paper or use a password manager.'
        },
        step4: {
          title: 'Set Password & Biometric',
          description: 'Protect your wallet with a password or biometric (fingerprint/face ID) for additional security.'
        },
        step5: {
          title: 'Get Wallet Address',
          description: 'Your wallet address (Public Address) will be displayed after creating the wallet. This address is used to receive TPC and other tokens.'
        },
        step6: {
          title: 'Copy Wallet Address',
          description: 'Copy your wallet address to use when purchasing TPC. Make sure the copied address is correct.'
        },
        step7: {
          title: 'Receive Tokens (Optional)',
          description: 'To receive TPC, you\'ll need a valid wallet address. Transactions will appear in Phantom Wallet after confirmation.'
        },
        step8: {
          title: 'Verify Address (Optional)',
          description: 'Always check the length and format of wallet addresses. Never paste seed phrases in address fields. Wallet addresses start with "So" or "5".'
        }
      },
      security: {
        title: '⚠️ Important Security Warnings',
        items: [
          'Your seed phrase is the master key to your wallet. NEVER share it with anyone, including TPC admins.',
          'TPC admins will never ask for your seed phrase. Beware of impersonators asking for sensitive information.',
          'Only use the official tpcglobal.io website for all transactions.',
          'Store your seed phrase in a secure, offline location (paper, digital vault, password manager).',
          'Enable two-factor authentication (2FA) if available.',
          'Always verify website URLs before entering sensitive information.'
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'What\'s the difference between Public Address and Seed Phrase?',
            a: 'Public Address can be shared to receive tokens. Seed Phrase is the secret key to restore wallet access. Never share your seed phrase!'
          },
          {
            q: 'What if I lose my seed phrase?',
            a: 'If you lose your seed phrase, access to your wallet is permanently lost. Create a new wallet and save the new seed phrase very securely.'
          },
          {
            q: 'Can I change my wallet address?',
            a: 'No, wallet addresses cannot be changed. Once created, the address is permanently tied to your seed phrase. For a new address, create a new wallet.'
          },
          {
            q: 'Why use Phantom Wallet?',
            a: 'Phantom is recommended for the Solana ecosystem due to its security, ease of use, and strong community support.'
          }
        ]
      },
      cta: {
        buy: 'Buy TPC Now',
        antiScam: 'Anti-Scam Info'
      },
      disclaimer: {
        text: 'This tutorial is for educational purposes only, not financial advice. Cryptocurrency investment carries high risk. Do your own research before investing.',
        warning: 'Never share your wallet seed phrase with anyone, including TPC admins.'
      }
    }
  };

  const steps: Step[] = [
    {
      id: 1,
      title: t[lang].steps.step1.title,
      description: t[lang].steps.step1.description,
      icon: <Download className="h-5 w-5" />,
      completed: completedSteps.includes(1)
    },
    {
      id: 2,
      title: t[lang].steps.step2.title,
      description: t[lang].steps.step2.description,
      icon: <Smartphone className="h-5 w-5" />,
      completed: completedSteps.includes(2)
    },
    {
      id: 3,
      title: t[lang].steps.step3.title,
      description: t[lang].steps.step3.description,
      icon: <Lock className="h-5 w-5" />,
      completed: completedSteps.includes(3)
    },
    {
      id: 4,
      title: t[lang].steps.step4.title,
      description: t[lang].steps.step4.description,
      icon: <Shield className="h-5 w-5" />,
      completed: completedSteps.includes(4)
    },
    {
      id: 5,
      title: t[lang].steps.step5.title,
      description: t[lang].steps.step5.description,
      icon: <Globe className="h-5 w-5" />,
      completed: completedSteps.includes(5)
    },
    {
      id: 6,
      title: t[lang].steps.step6.title,
      description: t[lang].steps.step6.description,
      icon: <Copy className="h-5 w-5" />,
      completed: completedSteps.includes(6)
    },
    {
      id: 7,
      title: t[lang].steps.step7.title,
      description: t[lang].steps.step7.description,
      icon: <Eye className="h-5 w-5" />,
      completed: completedSteps.includes(7)
    },
    {
      id: 8,
      title: t[lang].steps.step8.title,
      description: t[lang].steps.step8.description,
      icon: <AlertCircle className="h-5 w-5" />,
      completed: completedSteps.includes(8)
    }
  ];

  const dummyAddress = isID 
    ? '9j3s5k2L8mN7vP4qR6wT9yX2ZfA1bC3dE4fG5h6iJ7k8L9m0n1o2p'
    : '9j3s5k2L8mN7vP4qR6wT9yX2ZfA1bC3dE4fG5h6iJ7k8L9m0n1o2p';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(dummyAddress);
    setCopiedAddress(true);
    toast({
      title: isID ? 'Alamat Tersalin!' : 'Address Copied!',
      description: isID ? 'Alamat wallet telah disalin ke clipboard.' : 'Wallet address has been copied to clipboard.',
    });
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleStepClick = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const toggleSeedPhrase = () => {
    setShowSeedPhrase(!showSeedPhrase);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0A0B0F]/95 backdrop-blur-sm border-b border-[#1A1B22]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/${lang}`)}
              className="text-[#848E9C] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isID ? 'Kembali' : 'Back'}
            </Button>
            <h1 className="text-xl font-bold text-white">{t[lang].title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Card */}
        <Card className="bg-[#1E2329] border-[#2B3139] mb-8">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#F0B90B]/20 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-[#F0B90B]" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {t[lang].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[#848E9C] mb-6">
              {t[lang].subtitle}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {t[lang].intro.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-[#848E9C] text-sm">
                  <Check className="h-4 w-4 text-[#F0B90B]" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Section */}
        <Card className="bg-[#1E2329] border-[#2B3139] mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#F0B90B]" />
              {t[lang].why.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#848E9C]">
              {t[lang].why.description}
            </p>
          </CardContent>
        </Card>

        {/* Steps Section */}
        <Card className="bg-[#1E2329] border-[#2B3139] mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              {isID ? 'Langkah-Langkah' : 'Step-by-Step Guide'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  completedSteps.includes(step.id)
                    ? 'border-[#F0B90B] bg-[#F0B90B]/5'
                    : 'border-[#2B3139] bg-[#1E2329] hover:bg-[#2B3139]'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    completedSteps.includes(step.id)
                      ? 'bg-[#F0B90B] text-white'
                      : 'bg-[#2B3139] text-[#848E9C]'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[#848E9C] text-sm">
                      {step.description}
                    </p>
                    {step.id === 6 && (
                      <div className="mt-3">
                        <div className="bg-[#2B3139] rounded-lg p-3 border border-[#2B3139]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#848E9C] text-sm">Contoh Address:</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCopyAddress}
                              className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B]/10"
                            >
                              {copiedAddress ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  {isID ? 'Tersalin!' : 'Copied!'}
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  {isID ? 'Salin' : 'Copy'}
                                </>
                              )}
                            </Button>
                          </div>
                          <code className="text-xs text-[#F0B90B] break-all">
                            {dummyAddress}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Warnings */}
        <Card className="bg-[#1E2329] border-[#2B3139] mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              {t[lang].security.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {t[lang].security.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-[#1E2329] border-[#2B3139 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              {t[lang].faq.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t[lang].faq.items.map((item, index) => (
              <div key={index} className="border-b border-[#2B3139] pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F0B90B]/10 flex items-center justify-center">
                    <span className="text-[#F0B90B] text-sm font-medium">Q</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{item.q}</p>
                    <p className="text-[#848E9C] text-sm">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="border-[#2B3139] bg-[#1E2329] mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="text-sm">
              <strong>{t[lang].disclaimer.text}</strong>
            </p>
            <p className="text-sm text-red-400 mt-1">
              <strong>{t[lang].disclaimer.warning}</strong>
            </p>
          </AlertDescription>
        </Alert>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#F0B90B] hover:bg-[#E0A800] text-[#1A1B22] font-semibold py-3 px-6"
            onClick={() => navigate(`/${lang}/buytpc`)}
          >
            {t[lang].cta.buy}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B]/10 hover:text-white font-semibold py-3 px-6"
            onClick={() => navigate(`/${lang}/anti-scam`)}
          >
            {t[lang].cta.antiScam}
          </Button>
        </div>
      </div>
    </div>
  );
}
