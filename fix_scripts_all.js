const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      fixPage(fullPath);
    }
  }
}

function fixPage(fullPath) {
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('fix_scripts_applied')) return;

  // We only care about files that have htmlContent/scriptContent pattern
  if (!content.includes('dangerouslySetInnerHTML')) return;

  const pageDir = path.dirname(fullPath);
  const pageName = path.basename(pageDir);

  let extractedJs = '';
  let externalScripts = [];

  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let hasScripts = false;

  content = content.replace(scriptRegex, (match, innerCode) => {
    hasScripts = true;
    const srcMatch = match.match(/src=["'](.*?)["']/i);
    if (srcMatch) {
      externalScripts.push(srcMatch[1]);
      return ''; 
    } else {
      extractedJs += innerCode + '\n';
      return ''; 
    }
  });

  if (hasScripts) {
    if (extractedJs.trim() !== '') {
      const publicJsDir = path.join(__dirname, 'public/js');
      if (!fs.existsSync(publicJsDir)) {
        fs.mkdirSync(publicJsDir, { recursive: true });
      }
      const jsPath = path.join(publicJsDir, `${pageName}-script.js`);
      fs.writeFileSync(jsPath, extractedJs);
      externalScripts.push(`/js/${pageName}-script.js`);
    }

    if (!content.includes("import Script from 'next/script'")) {
      content = `import Script from 'next/script';\n` + content;
    }

    const scriptTags = externalScripts.map(src => `<Script src="${src}" strategy="lazyOnload" />`).join('\n      ');
    
    // Inject scripts right before </>
    content = content.replace('</>', `  ${scriptTags}\n      {/* fix_scripts_applied */}\n    </>`);

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${fullPath}`);
  }
}

const adminDir = path.join(__dirname, 'src/app/(admin)');
if (fs.existsSync(adminDir)) {
  processDir(adminDir);
}
