# Supabase CLI Instructions for Windows PowerShell

## Issue: PowerShell tidak mendukung `&&` dan CLI belum terpasang

## Solution 1: Install Supabase CLI (Recommended)

### Option A: Global Installation
```powershell
# Install globally
npm install -g supabase

# Verify installation
supabase --version
```

### Option B: Use npx (No installation needed)
```powershell
# Use npx for one-time commands
npx supabase --version
```

## Solution 2: PowerShell Commands (Tanpa &&)

### Instead of:
```bash
cd d:/tpc-gateway-main && supabase db push
```

### Use separate commands:
```powershell
# Step 1: Change directory
cd d:/tpc-gateway-main

# Step 2: Run Supabase command
supabase db push
```

## Common Commands

### Generate Types
```powershell
cd d:/tpc-gateway-main
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Push Migrations
```powershell
cd d:/tpc-gateway-main
supabase db push
```

### Check Status
```powershell
cd d:/tpc-gateway-main
supabase status
```

## Alternative: Use Command Prompt (cmd)
Jika PowerShell bermasalah, gunakan Command Prompt:
```cmd
cd /d d:\tpc-gateway-main
supabase db push
```

## Note
- File types sudah diupdate manual di src/integrations/supabase/types.ts
- Build sudah PASS tanpa error
- AdminUsersPage sudah production-ready
