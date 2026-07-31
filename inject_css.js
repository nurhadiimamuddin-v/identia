const fs = require('fs');
const path = require('path');

// Mapping: PHP source -> Next.js page.tsx
const pageMap = {
  'chats.php': 'src/app/(admin)/chats/page.tsx',
  'notifications.php': 'src/app/(admin)/notifications/page.tsx',
  'dashboard.php': 'src/app/(admin)/dashboard/page.tsx',
  'history.php': 'src/app/(admin)/history/page.tsx',
  'schedule.php': 'src/app/(admin)/schedule/page.tsx',
  'access.php': 'src/app/(admin)/access/page.tsx',
  'room.php': 'src/app/(admin)/room/page.tsx',
  'account.php': 'src/app/(admin)/account/page.tsx',
  'manage_occupant.php': 'src/app/(admin)/occupant/manage/page.tsx',
  'new_occupant.php': 'src/app/(admin)/occupant/new/page.tsx',
  'tft.php': 'src/app/(admin)/tft/page.tsx',
};

const phpRoot = 'c:/laragon/www/identia';
const nextRoot = 'c:/laragon/www/identia/identia-next';

Object.entries(pageMap).forEach(([phpFile, nextPage]) => {
  const phpPath = path.join(phpRoot, phpFile);
  const nextPath = path.join(nextRoot, nextPage);

  if (!fs.existsSync(phpPath)) {
    console.log(`SKIP: ${phpFile} not found`);
    return;
  }
  if (!fs.existsSync(nextPath)) {
    console.log(`SKIP: ${nextPage} not found`);
    return;
  }

  const phpContent = fs.readFileSync(phpPath, 'utf8');

  // Extract all <style>...</style> blocks from PHP
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let allCss = '';
  let match;
  while ((match = styleRegex.exec(phpContent)) !== null) {
    allCss += match[1].trim() + '\n\n';
  }

  if (!allCss.trim()) {
    console.log(`NO CSS in ${phpFile}`);
    return;
  }

  // Save CSS to public/css/pages/{name}.css
  const pageName = path.basename(phpFile, '.php');
  const cssDir = path.join(nextRoot, 'public/css/pages');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  const cssPath = path.join(cssDir, `${pageName}.css`);
  fs.writeFileSync(cssPath, allCss);
  console.log(`Extracted CSS: ${pageName}.css (${allCss.length} chars)`);

  // Now update the Next.js page to include this CSS.
  // We prepend a <style> block to the htmlContent.
  let nextContent = fs.readFileSync(nextPath, 'utf8');

  // Check if already has the injected style marker
  if (nextContent.includes('/* PAGE_CSS_INJECTED */')) {
    console.log(`  Already injected in ${nextPage}`);
    return;
  }

  // Find the htmlContent template literal start and inject after it
  // Pattern: const htmlContent = `\n
  const htmlContentStart = nextContent.indexOf("const htmlContent = `");
  if (htmlContentStart === -1) {
    console.log(`  No htmlContent found in ${nextPage}`);
    return;
  }

  // Find the backtick after the =
  const backtickPos = nextContent.indexOf('`', htmlContentStart + 20);
  if (backtickPos === -1) {
    console.log(`  No backtick found in ${nextPage}`);
    return;
  }

  // Escape backticks in CSS for template literal
  let escapedCss = allCss.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  // Inject style block right after the opening backtick
  const styleBlock = `\n<style>/* PAGE_CSS_INJECTED */\n${escapedCss}</style>\n`;
  nextContent = nextContent.slice(0, backtickPos + 1) + styleBlock + nextContent.slice(backtickPos + 1);

  fs.writeFileSync(nextPath, nextContent);
  console.log(`  Injected CSS into ${nextPage}`);
});
