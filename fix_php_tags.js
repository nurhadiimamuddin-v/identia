const fs = require('fs');
const files = [
  'c:/laragon/www/identia/identia-next/src/app/(admin)/occupant/manage/page.tsx',
  'c:/laragon/www/identia/identia-next/src/app/(admin)/occupant/new/page.tsx',
  'c:/laragon/www/identia/identia-next/src/app/(admin)/notifications/page.tsx',
  'c:/laragon/www/identia/identia-next/src/app/(admin)/chats/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<\?php/gi, '');
  fs.writeFileSync(f, content);
});
console.log("Removed php tags");
