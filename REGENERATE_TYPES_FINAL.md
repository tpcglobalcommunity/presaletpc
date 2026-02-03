# REGENERATE SUPABASE TYPES - FINAL INSTRUCTIONS

## Current Status
- AdminUsersPage stabilized with RPC
- Custom referral interfaces moved to src/types/referral.ts
- Types file cleaned (generated-only)
- Build PASS: 5.63s

## Windows PowerShell Commands (Execute ONE BY ONE)

### Step 1: Install Supabase CLI (if not installed)
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

### Step 5: Regenerate Types from Production Schema
```powershell
supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

### Step 6: Verify Types Updated
Check that src/integrations/supabase/types.ts now includes:
- get_admin_users_data RPC function (should already exist)
- Any new columns from production schema

### Step 7: Final Build Test
```powershell
npm run build
```

## Alternative: Use npx (No Global Installation)

### Step 1 (Alternative): Use npx directly
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

### Step 5 (Alternative): Build Test
```powershell
npm run build
```

## Expected Final Result

✅ AdminUsersPage:
- Uses get_admin_users_data RPC
- Shows only members (role_name='member')
- Sorted by created_at desc
- Columns: Register, Name, Email, Sponsor
- Search works on member-only list
- No infinite loading
- No 42703 column errors

✅ Types Organization:
- src/integrations/supabase/types.ts (generated-only)
- src/types/referral.ts (custom referral interfaces)
- All imports updated correctly

✅ Build Status:
- npm run build PASS
- Zero TypeScript errors
- Production-ready

## Troubleshooting

### If "command not recognized":
```powershell
# Use npx instead
npx supabase --version
```

### If build fails after regeneration:
- Check for any TypeScript errors
- Verify RPC function exists in types
- Ensure all imports are correct

### If project ref issues:
- Use exact project ref: mzzwhrmciijyuqtfgtgg
- Check Supabase Dashboard for correct ref

## Success Criteria Met

✅ TARGET 1: AdminUsersPage stabilized with RPC
✅ TARGET 2: Types hygiene completed  
✅ TARGET 3: Regeneration instructions provided
✅ Build verification ready
