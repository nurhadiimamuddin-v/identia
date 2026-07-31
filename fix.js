const fs = require('fs');

// Fix register/page.tsx - replace escaped backticks with real backticks
let content = fs.readFileSync('c:/laragon/www/identia/identia-next/src/app/register/page.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
fs.writeFileSync('c:/laragon/www/identia/identia-next/src/app/register/page.tsx', content);
console.log('Fixed register/page.tsx - replaced escaped backticks');

// Also check and fix chats/page.tsx
let chats = fs.readFileSync('c:/laragon/www/identia/identia-next/src/app/(admin)/chats/page.tsx', 'utf8');
if (chats.includes('\\`')) {
    chats = chats.replace(/\\`/g, '`');
    fs.writeFileSync('c:/laragon/www/identia/identia-next/src/app/(admin)/chats/page.tsx', chats);
    console.log('Fixed chats/page.tsx');
} else {
    console.log('chats/page.tsx OK');
}

// Check notifications/page.tsx
let notif = fs.readFileSync('c:/laragon/www/identia/identia-next/src/app/(admin)/notifications/page.tsx', 'utf8');
if (notif.includes('\\`')) {
    notif = notif.replace(/\\`/g, '`');
    fs.writeFileSync('c:/laragon/www/identia/identia-next/src/app/(admin)/notifications/page.tsx', notif);
    console.log('Fixed notifications/page.tsx');
} else {
    console.log('notifications/page.tsx OK');
}
