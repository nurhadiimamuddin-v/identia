const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'public/js');

if (fs.existsSync(jsDir)) {
  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('-script.js'));
  
  files.forEach(file => {
    const fullPath = path.join(jsDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    // Replace \${ with ${
    content = content.replace(/\\\${/g, '${');
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed escapes in ' + file);
  });
}
