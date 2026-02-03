# ADMIN USERS PAGE FIX PLAN (After Types Regeneration)

## This plan will be implemented AFTER types are regenerated

## Step 1 - Type Aliases (Fix "excessively deep" error)
```typescript
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

const [profiles, setProfiles] = useState<ProfileRow[]>([]);
const [sponsors, setSponsors] = useState<ProfileRow[]>([]);
```

## Step 2 - Query Structure
```typescript
// Main query - only existing columns
const { data: profilesData, error: profilesError } = await supabase
  .from('profiles')
  .select(`
    id,
    user_id,
    created_at,
    email_initial,
    email_current,
    member_code,
    referral_code,
    referred_by_code,
    role
  `)
  .eq('role', 'member')
  .order('created_at', { ascending: false });
```

## Step 3 - Sponsor Logic (Conditional based on available columns)
```typescript
// Check if referred_by_code exists in types
const sponsorCodes = [...new Set(
  profiles
    .map(p => p.referred_by_code) // Use if exists
    .filter(Boolean)
)] as string[];

// Fetch sponsors by referral_code
const { data: sponsorsData } = await supabase
  .from('profiles')
  .select('member_code, referral_code')
  .in('referral_code', sponsorCodes);

// Helper function
const getSponsor = (referredByCode: string | null) => {
  if (!referredByCode) return null;
  return sponsors.find(s => s.referral_code === referredByCode);
};
```

## Step 4 - Table Structure
```typescript
// Table headers
<th>Register</th>
<th>Name</th>
<th>Email</th>
<th>Sponsor</th>

// Table body
<td>{formatDate(profile.created_at)}</td>
<td>{profile.member_code}</td>
<td>{getEmail(profile)}</td>
<td>{sponsor ? sponsor.member_code : '-'}</td>
```

## Step 5 - Helper Functions
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

const getEmail = (profile: ProfileRow) => {
  return profile.email_current || profile.email_initial || "Email tidak tersedia";
};
```

## Expected Final Result
- Members only (role='member' filter)
- Sponsor display using referred_by_code -> referral_code mapping
- No TypeScript errors
- Build PASS
- No 42703 column errors
