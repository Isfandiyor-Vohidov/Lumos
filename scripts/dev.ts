import { execSync } from 'node:child_process';

execSync('pnpm turbo dev', { stdio: 'inherit', cwd: '..' });