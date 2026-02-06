// Public bottom navigation configuration
export const publicBottomNavItems = [
  {
    id: 'home',
    hrefBase: '', // Will become /{lang}
    icon: 'Home'
  },
  {
    id: 'market',
    hrefBase: 'market', // Will become /{lang}/market
    icon: 'TrendingUp'
  },
  {
    id: 'presale',
    hrefBase: 'presale', // Will become /{lang}/presale
    icon: 'Coins'
  },
  {
    id: 'login',
    hrefBase: 'login', // Will become /{lang}/login
    icon: 'LogIn'
  },
  {
    id: 'menu',
    hrefBase: 'menu', // Will become /{lang}/menu
    icon: 'Menu'
  }
];
