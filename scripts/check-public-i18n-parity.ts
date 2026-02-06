import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check public i18n parity between EN and ID
const enPath = resolve(__dirname, '../src/i18n/public/en.ts');
const idPath = resolve(__dirname, '../src/i18n/public/id.ts');

try {
  const enContent = readFileSync(enPath, 'utf8');
  const idContent = readFileSync(idPath, 'utf8');
  
  // Parse the exports to get keys
  const enKeys = extractKeys(enContent);
  const idKeys = extractKeys(idContent);
  
  // Check for missing keys in ID
  const missingInId = enKeys.filter(key => !idKeys.includes(key));
  if (missingInId.length > 0) {
    console.warn('⚠️  MISSING ID KEYS (Public Copy):');
    missingInId.forEach(key => console.warn(`  - ${key}`));
    console.warn('\nThese keys will fallback to EN automatically.');
  }
  
  // Check for missing keys in EN (should not happen)
  const missingInEn = idKeys.filter(key => !enKeys.includes(key));
  if (missingInEn.length > 0) {
    console.error('🚨 MISSING EN KEYS (Public Copy):');
    missingInEn.forEach(key => console.error(`  - ${key}`));
    console.error('\nEN should be the complete source of truth!');
    process.exit(1); // Fail CI if EN is incomplete
  }
  
  console.log('✅ Public copy parity check passed');
  
} catch (error) {
  console.error('❌ Failed to check public copy parity:', error);
  process.exit(1);
}

function extractKeys(content: string): string[] {
  const keys: string[] = [];
  
  // Extract keys from export patterns
  const exportMatches = content.match(/export\s+const\s+\w+\s*=\s*{([^}]+)}/gs);
  if (exportMatches) {
    exportMatches.forEach(match => {
      const objectContent = match[1];
      // Extract top-level keys
      const keyMatches = objectContent.match(/(\w+):/g);
      if (keyMatches) {
        keyMatches.forEach(keyMatch => {
          const key = keyMatch.replace(':', '').trim();
          if (key && !keys.includes(key)) {
            keys.push(key);
          }
        });
      }
    });
  }
  
  return keys;
}
