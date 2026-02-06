import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Phone, MapPin, Wallet, LogOut, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getWalletFieldName, isValidWalletAddress, isValidWhatsAppNumber } from '@/lib/profileValidation';

export default function CompleteProfilePage() {
  const { lang } = useParams();
  const { user, profile, refreshProfile, safeSignOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const safeLang = lang === 'en' ? 'en' : 'id';

  const [formData, setFormData] = useState({
    nama_lengkap: profile?.nama_lengkap || '',
    email: user?.email || '',
    no_wa: profile?.no_wa || '',
    kota: profile?.kota || '',
    [getWalletFieldName()]: profile?.tpc_wallet_address || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  useEffect(() => {
    // Update email when user data loads
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.nama_lengkap.trim()) errors.push('Full name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.no_wa.trim()) errors.push('WhatsApp number is required');
    if (!isValidWhatsAppNumber(formData.no_wa)) errors.push('Invalid WhatsApp number (min 8 digits, numbers and + only)');
    if (!formData.kota.trim()) errors.push('City is required');
    
    const walletField = getWalletFieldName();
    if (!formData[walletField].trim()) {
      errors.push('TPC wallet address is required');
    } else if (!isValidWalletAddress(formData[walletField])) {
      errors.push('TPC wallet address must be 32-44 characters');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: any = {
        nama_lengkap: formData.nama_lengkap.trim(),
        email: formData.email.trim(),
        no_wa: formData.no_wa.trim(),
        kota: formData.kota.trim(),
        updated_at: new Date().toISOString()
      };

      const walletField = getWalletFieldName();
      updateData[walletField] = formData[walletField].trim();

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Refresh profile in context
      await refreshProfile();

      toast({
        title: "Success",
        description: "Profile saved successfully",
      });

      // Redirect to member dashboard
      navigate(`/${safeLang}/member/dashboard`);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await safeSignOut();
    navigate(`/${safeLang}/login`);
  };

  const walletField = getWalletFieldName();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {t('Complete Your Profile', 'Lengkapi Profil Anda')}
            </CardTitle>
            <p className="text-gray-400 text-sm">
              {t('Complete your profile to access member area', 'Lengkapi profil Anda untuk mengakses area member')}
            </p>
            
            {/* Sponsor Info */}
            {profile?.sponsor_code && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-300">
                    {t('Your Sponsor', 'Sponsor Anda')}: 
                    <span className="font-semibold text-amber-400 ml-1">
                      {profile.sponsor_code}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="nama_lengkap" className="text-gray-300">
                  {t('Full Name', 'Nama Lengkap')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nama_lengkap"
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                    placeholder={t('Enter your full name', 'Masukkan nama lengkap')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  {t('Email', 'Email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="pl-10 bg-slate-700/50 border-slate-600 text-gray-400"
                    placeholder={t('Email from Google account', 'Email dari akun Google')}
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label htmlFor="no_wa" className="text-gray-300">
                  {t('WhatsApp Number', 'No WhatsApp')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="no_wa"
                    type="tel"
                    value={formData.no_wa}
                    onChange={(e) => handleInputChange('no_wa', e.target.value)}
                    placeholder={t('Enter your WhatsApp number', 'Masukkan nomor WhatsApp')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="kota" className="text-gray-300">
                  {t('City', 'Kota')}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="kota"
                    type="text"
                    value={formData.kota}
                    onChange={(e) => handleInputChange('kota', e.target.value)}
                    placeholder={t('Enter your city', 'Masukkan kota')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label htmlFor={walletField} className="text-gray-300">
                  {t('TPC Wallet Address', 'Alamat Wallet TPC')}
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={walletField}
                    type="text"
                    value={formData[walletField]}
                    onChange={(e) => handleInputChange(walletField, e.target.value)}
                    placeholder={t('Enter your TPC Solana wallet address', 'Masukkan alamat wallet TPC Solana')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500 font-mono text-sm"
                    required
                    minLength={32}
                    maxLength={44}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('Saving...', 'Menyimpan...')}</span>
                    </div>
                  ) : (
                    <span>{t('Save & Continue', 'Simpan & Lanjut')}</span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-slate-600 text-gray-400 hover:bg-slate-800 hover:text-white py-3 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>{t('Logout', 'Keluar')}</span>
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
