# REGENERATE SUPABASE TYPES - WINDOWS POWERSHELL

## Current Status
- AdminUsersPage prepared for types regeneration
- Manual edits removed from types.ts
- Build passes: 5.44s
- Ready for proper types generation

## Windows PowerShell Commands (No &&)

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

### Step 4: Link to Your Project (replace with your project ref)
```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 5: Regenerate Types from Production Schema
```powershell
supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

### Step 6: Verify Types Updated
Check that `src/integrations/supabase/types.ts` now includes:
- `role: string` in profiles.Row
- Any other existing columns from production

### Step 7: Build and Test
```powershell
npm run build
```

## Alternative: Use npx (No Global Installation)

### Step 1: Use npx directly
```powershell
npx supabase --version
```

### Step 2: Login
```powershell
npx supabase login
```

### Step 3: Link
```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Step 4: Generate Types
```powershell
npx supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

## Expected Result After Types Regeneration

AdminUsersPage should work with:
- `.eq('role','member')` filtering
- Only existing columns from production schema
- Member-only display
- Zero TypeScript errors
- Build PASS

## Troubleshooting

### If "command not recognized":
```powershell
# Use npx instead
npx supabase --version
```

### If project ref unknown:
1. Go to Supabase Dashboard
2. Select your project
3. Settings > General
4. Copy "Project Reference"

### If permission denied:
- Ensure you're logged in with correct account
- Check project access permissions

## Current AdminUsersPage Features

✅ Member-only filtering (.eq('role','member'))
✅ Table: Register, UID, Display Name, Email, Role
✅ Search on email and member_code
✅ Stable loading with error handling
✅ Production-ready (build passes)

⏳ Sponsor logic: Will show '-' until sponsor column exists in schema
