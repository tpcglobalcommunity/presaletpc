# REGENERATE SUPABASE TYPES - WINDOWS POWERSHELL COMMANDS

## Execute these commands in Windows PowerShell (one by one)

### Step 1: Install Supabase CLI
```powershell
npm install -g supabase
```

### Step 2: Verify Installation
```powershell
supabase --version
```

### Step 3: Login to Supabase
```powershell
supabase login
```

### Step 4: Link to Project
```powershell
supabase link --project-ref mzzwhrmciijyuqtfgtgg
```

### Step 5: Generate Types from Production Schema
```powershell
supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

### Step 6: Verify Types Updated
After running Step 5, check that src/integrations/supabase/types.ts includes:
- role: string in profiles.Row
- referred_by_code: string | null (if exists)
- referral_code: string | null (if exists)

### Step 7: Build Test
```powershell
npm run build
```

## Alternative: Use npx (if global install fails)

### Step 1 (Alternative): Use npx
```powershell
npx supabase --version
```

### Step 2 (Alternative): Login
```powershell
npx supabase login
```

### Step 3 (Alternative): Link
```powershell
npx supabase link --project-ref mzzwhrmciijyuqtfgtgg
```

### Step 4 (Alternative): Generate Types
```powershell
npx supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

## IMPORTANT NOTES

1. Run commands ONE BY ONE (do not copy-paste all at once)
2. Use the exact project reference: mzzwhrmciijyuqtfgtgg
3. After types are regenerated, the AdminUsersPage will be updated accordingly
4. Do NOT manually edit types.ts file
