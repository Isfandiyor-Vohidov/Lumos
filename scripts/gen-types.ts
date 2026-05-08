import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const supabasePath = resolve(__dirname, '..', 'supabase');
execSync('npx supabase gen types typescript --local > ../packages/shared/src/types/database.ts', {
  stdio: 'inherit',
  cwd: supabasePath,
});