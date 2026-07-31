const fs = require('fs');

// For chats and notifications, we need to check if they use the
// `const htmlContent = `...`` pattern from migrate_page.py
// If so, any backticks INSIDE the content need to be escaped

function fixMigratedPage(filePath, label) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this uses the migrate_page.py pattern with htmlContent/scriptContent template literals
    // These files have:  const htmlContent = `...`;  and  const scriptContent = `...`;
    // Any backticks inside those template literals need to be escaped
    
    // Find all template literal blocks between const htmlContent = ` and `; / const scriptContent = ` and `;
    let fixed = content;
    
    // Strategy: Find the template literal sections and escape internal backticks
    const patterns = [
        { start: "const htmlContent = `", end: "  `;" },
        { start: "const scriptContent = `", end: "  `;" }
    ];
    
    for (const pat of patterns) {
        const startIdx = fixed.indexOf(pat.start);
        if (startIdx === -1) continue;
        
        const contentStart = startIdx + pat.start.length;
        // Find the matching closing backtick+semicolon
        // We need to find `  `;` that's on its own line after the content
        let searchFrom = contentStart;
        let endIdx = -1;
        
        while (true) {
            endIdx = fixed.indexOf('\n  `;', searchFrom);
            if (endIdx === -1) {
                // Try alternate pattern
                endIdx = fixed.indexOf('\n`;', searchFrom);
                if (endIdx === -1) break;
                endIdx += 1; // point to the backtick
                break;
            }
            endIdx += 1; // point past newline, to the spaces
            // Check this is the actual end, not content
            break;
        }
        
        if (endIdx === -1) {
            console.log(`  Could not find end of ${pat.start} in ${label}`);
            continue;
        }
        
        // Extract the inner content and escape any backticks and ${ inside it
        let inner = fixed.substring(contentStart, endIdx);
        let escapedInner = inner.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
        fixed = fixed.substring(0, contentStart) + escapedInner + fixed.substring(endIdx);
        console.log(`  Escaped backticks in ${pat.start.trim()} block`);
    }
    
    if (fixed !== content) {
        fs.writeFileSync(filePath, fixed);
        console.log(`Fixed ${label}`);
    } else {
        console.log(`${label} - no changes needed`);
    }
}

fixMigratedPage('c:/laragon/www/identia/identia-next/src/app/(admin)/chats/page.tsx', 'chats/page.tsx');
fixMigratedPage('c:/laragon/www/identia/identia-next/src/app/(admin)/notifications/page.tsx', 'notifications/page.tsx');
