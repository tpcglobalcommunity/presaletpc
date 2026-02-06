import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Coins, 
  LogIn, 
  Menu, 
  Shield, 
  ArrowRight,
  FileText,
  Users,
  BookOpen,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function PublicMenuPage() {
  const navigate = useNavigate();
  const { lang = 'id' } = useParams<{ lang: string }>();
  
  // Strict lang validation: only "en" or "id" allowed
  const safeLang = lang === 'en' ? 'en' : 'id';

  const menuItems = [
    {
      group: 'Core',
      items: [
        {
          icon: Home,
          title: 'Home',
          subtitle: 'Main dashboard',
          href: `/${safeLang}`
        },
        {
          icon: TrendingUp,
          title: 'Market',
          subtitle: 'Trading marketplace',
          href: `/${safeLang}/market`
        },
        {
          icon: Coins,
          title: 'Presale',
          subtitle: 'Token presale',
          href: `/${safeLang}/presale`
        }
      ]
    },
    {
      group: 'Account',
      items: [
        {
          icon: LogIn,
          title: 'Login',
          subtitle: 'Sign in to your account',
          href: `/${safeLang}/login`
        }
      ]
    },
    {
      group: 'Trust & Safety',
      items: [
        {
          icon: Shield,
          title: 'Anti-Scam',
          subtitle: 'Safety & Trust',
          href: `/${safeLang}/anti-scam`
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Menu - TPC Global</title>
        <meta name="description" content="TPC Global Menu - Complete navigation" />
      </Helmet>
      
      <div className="min-h-screen bg-[#0B0E11]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Menu</h1>
            <p className="text-muted-foreground">Complete navigation</p>
          </div>

          {/* Menu Groups */}
          <div className="space-y-8">
            {menuItems.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h2 className="text-xl font-semibold text-white mb-4">{group.group}</h2>
                <div className="space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => navigate(item.href)}
                      className="w-full glass-card p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              Choose an option above to navigate
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
