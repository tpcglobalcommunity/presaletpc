import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Phone, MapPin, Wallet, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function OnboardingPage() {
  const { lang } = useParams();
  const { user, profile, refreshProfile, safeSignOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const safeLang = lang === 'en' ? 'en' : 'id';

  const [formData, setFormData] = useState({
    nama: profile?.nama || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    wallet_address: profile?.wallet_address || ''
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

    if (!formData.nama.trim()) errors.push('Nama wajib diisi');
    if (!formData.email.trim()) errors.push('Email wajib diisi');
    if (!formData.phone.trim()) errors.push('No HP wajib diisi');
    if (!formData.city.trim()) errors.push('Kota wajib diisi');
    if (!formData.wallet_address.trim()) errors.push('Wallet address wajib diisi');
    if (formData.wallet_address.trim().length < 32 || formData.wallet_address.trim().length > 44) {
      errors.push('Wallet address harus 32-44 karakter');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validasi Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nama: formData.nama.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          wallet_address: formData.wallet_address.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Refresh profile in context
      await refreshProfile();

      toast({
        title: "Berhasil",
        description: "Profil berhasil disimpan",
      });

      // Redirect to member dashboard
      navigate(`/${safeLang}/member/dashboard`);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan profil. Silakan coba lagi.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {t('Complete Profile', 'Lengkapi Profil')}
            </CardTitle>
            <p className="text-gray-400 text-sm">
              {t('Complete your profile to access member area', 'Lengkapi profil Anda untuk mengakses area member')}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-gray-300">
                  {t('Full Name', 'Nama Lengkap')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nama"
                    type="text"
                    value={formData.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  {t('Phone Number', 'No HP')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t('Enter your phone number', 'Masukkan nomor HP')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-300">
                  {t('City', 'Kota')}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder={t('Enter your city', 'Masukkan kota')}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label htmlFor="wallet_address" className="text-gray-300">
                  {t('Solana Wallet Address', 'Alamat Wallet Solana')}
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="wallet_address"
                    type="text"
                    value={formData.wallet_address}
                    onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                    placeholder={t('Enter your Solana wallet address', 'Masukkan alamat wallet Solana')}
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
