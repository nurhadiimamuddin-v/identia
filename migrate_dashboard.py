import re
import os

with open('c:\\laragon\\www\\identia\\dashboard.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract from <div class="main-panel"> to the end, excluding include 'footer.php'
start_idx = content.find('<div class="content-wrapper">')
end_idx = content.find('<!-- partial:partials/_footer.html -->')

html_content = content[start_idx:end_idx]

# Extract scripts
scripts_start = content.find('<!-- DASHBOARD SCRIPTS -->')
scripts_content = content[scripts_start:]

# Replace PHP variables with string formatting placeholders
html_content = html_content.replace('<?= htmlspecialchars(addslashes($dashName)) ?>', '${dashName}')
html_content = html_content.replace('<?= htmlspecialchars($dashFotoSrc) ?>', '${dashFotoSrc}')
html_content = html_content.replace('<?= htmlspecialchars($dashName2) ?>', '${dashName2}')
html_content = html_content.replace('<?= htmlspecialchars($dashUsername) ?>', '${dashUsername}')
html_content = html_content.replace('<?= $total_occupant ?>', '${totalOccupant}')
html_content = html_content.replace('<?= $total_account ?>', '${totalAccount}')
html_content = html_content.replace('<?php', '<!--')
html_content = html_content.replace('?>', '-->')
# Also remove other php echo usages if any

script_content_clean = scripts_content.replace("<?php include 'footer.php'; ?>", "").replace("</body>", "").replace("</html>", "")

tsx_code = f"""
import React from 'react';

export default async function DashboardPage() {{
  // Mock data for now, later fetch from Firebase
  const dashName = "Admin";
  const dashName2 = "Admin Web";
  const dashUsername = "admin";
  const dashFotoSrc = "/images/admin.png";
  const totalOccupant = 12;
  const totalAccount = 2;

  const htmlContent = `
{html_content}
  `;

  const scriptContent = `
{script_content_clean}
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{{{ __html: htmlContent }}}} />
      <div dangerouslySetInnerHTML={{{{ __html: scriptContent }}}} />
    </>
  );
}}
"""

os.makedirs('c:\\laragon\\www\\identia\\identia-next\\src\\app\\(admin)\\dashboard', exist_ok=True)
with open('c:\\laragon\\www\\identia\\identia-next\\src\\app\\(admin)\\dashboard\\page.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_code)

print("Created page.tsx successfully.")
