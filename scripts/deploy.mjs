// Pubblica dist/ sul branch gh-pages (GitHub Pages, "Deploy from a branch").
// Usa un worktree in .pages/: ogni deploy è un commit normale, niente push forzati.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (cmd, cwd = '.') => execSync(cmd, { stdio: 'inherit', cwd });
const out = (cmd, cwd = '.') => execSync(cmd, { cwd }).toString().trim();
const PAGES = '.pages';

run('npm run build');

if (!fs.existsSync(PAGES)) {
  const remoteHas = out('git ls-remote --heads origin gh-pages') !== '';
  if (remoteHas) {
    run('git fetch -q origin gh-pages');
    run(`git worktree add -q ${PAGES} -B gh-pages origin/gh-pages`);
  } else {
    run(`git worktree add -q --orphan -b gh-pages ${PAGES}`);
  }
}

// sostituisce i file pubblicati con la build appena fatta
if (out('git ls-files', PAGES)) run('git rm -r -q .', PAGES);
fs.cpSync('dist', PAGES, { recursive: true });
fs.writeFileSync(path.join(PAGES, '.nojekyll'), '');
run('git add -A', PAGES);
if (out('git status --porcelain', PAGES)) {
  run(`git commit -q -m "deploy ${new Date().toISOString()}"`, PAGES);
  run('git push -q -u origin gh-pages', PAGES);
} else {
  console.log('Nessuna modifica da pubblicare.');
}
