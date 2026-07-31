const fs = require('fs');
const path = require('path');

const pagesToFix = [
  'src/app/(admin)/dashboard/page.tsx',
  'src/app/(admin)/chats/page.tsx',
  'src/app/(admin)/notifications/page.tsx',
];

pagesToFix.forEach((relPath) => {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Only process if not already processed
  if (content.includes('fix_scripts_applied')) return;

  const pageName = path.basename(path.dirname(fullPath)); // e.g. dashboard, chats

  let extractedJs = '';
  let externalScripts = [];

  // Regex to match <script ...>...</script> or <script .../> (non-greedy)
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

  // Process htmlContent and scriptContent separately to remove them
  // We will just do a global replace on the whole file content for simplicity,
  // but we must be careful not to match things outside the string literals.
  // Actually, since they are inside the file, we can just replace them directly.
  
  // Wait, Next.js 'Script' component is better, but maybe we can just extract everything.
  content = content.replace(scriptRegex, (match, innerCode, offset, string) => {
    // If it has a src attribute, save it to externalScripts
    const srcMatch = match.match(/src=["'](.*?)["']/i);
    if (srcMatch) {
      externalScripts.push(srcMatch[1]);
      return ''; // Remove from htmlContent/scriptContent
    } else {
      // Inline script
      extractedJs += innerCode + '\n';
      return ''; // Remove from htmlContent/scriptContent
    }
  });

  if (extractedJs.trim() !== '' || externalScripts.length > 0) {
    // Write extracted JS to public/js/
    if (extractedJs.trim() !== '') {
      const jsPath = path.join(__dirname, `public/js/${pageName}-script.js`);
      // We need to wrap it in a DOMContentLoaded or just let it run
      // Since we use lazyOnload, it runs after load anyway, but just to be safe:
      fs.writeFileSync(jsPath, extractedJs);
      externalScripts.push(`/js/${pageName}-script.js`);
    }

    // Add import Script from 'next/script';
    if (!content.includes("import Script from 'next/script'")) {
      content = `import Script from 'next/script';\n` + content;
    }

    // Modify the return statement
    // Find: return ( <> ... </> );
    // We will inject the <Script> tags right before the closing </>
    const scriptTags = externalScripts.map(src => `<Script src="${src}" strategy="lazyOnload" />`).join('\n      ');
    
    // Simple replacement: replace `</>` with `${scriptTags}\n    </>`
    // Assuming the file ends with </> or we can inject it right after the dangerouslySetInnerHTML
    content = content.replace('</>', `  ${scriptTags}\n      {/* fix_scripts_applied */}\n    </>`);

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${pageName}`);
  } else {
    console.log(`No scripts found in ${pageName}`);
  }
});
