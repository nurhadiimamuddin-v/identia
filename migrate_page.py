import sys
import os
import re

if len(sys.argv) < 3:
    print("Usage: python migrate_page.py <input_php_file> <output_route_path>")
    sys.exit(1)

input_file = sys.argv[1]
output_route = sys.argv[2]
output_dir = os.path.join('c:\\laragon\\www\\identia\\identia-next\\src\\app', output_route)
output_file = os.path.join(output_dir, 'page.tsx')

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract from <div class="main-panel"> or <div class="content-wrapper">
start_idx = content.find('<div class="content-wrapper">')
if start_idx == -1:
    start_idx = content.find('<div class="main-panel">')
if start_idx == -1:
    # Just take everything after header.php
    header_idx = content.find("include 'header.php';")
    if header_idx != -1:
        start_idx = content.find('?>', header_idx) + 2
    else:
        start_idx = 0

end_idx = content.find("include 'footer.php';")
if end_idx == -1:
    end_idx = content.find("<!-- partial:partials/_footer.html -->")
if end_idx == -1:
    end_idx = len(content)

html_content = content[start_idx:end_idx]

# Remove PHP tags from HTML content (very rough, better to manually fix complex loops later)
html_content = re.sub(r'<\?php.*?\?>', '', html_content, flags=re.DOTALL)
html_content = re.sub(r'<\?=.*?\?>', '', html_content, flags=re.DOTALL)

# Extract scripts at the bottom
script_content_clean = ""
scripts_start = content.find('<!-- ========================== JS ========================== -->')
if scripts_start == -1:
    scripts_start = content.find('<script', end_idx)

if scripts_start != -1:
    scripts_content = content[scripts_start:]
    script_content_clean = scripts_content.replace("<?php include 'footer.php'; ?>", "").replace("<?php include 'copy.php'; ?>", "").replace("</body>", "").replace("</html>", "")
    script_content_clean = re.sub(r'<\?php.*?\?>', '', script_content_clean, flags=re.DOTALL)

component_name = output_route.split('/')[-1].replace('-', ' ').title().replace(' ', '') + "Page"
if component_name == "Page":
    component_name = "AdminPage"

# Escape backticks and ${ to prevent syntax errors in Next.js page.tsx template literals
html_content = html_content.replace('`', '\\`').replace('${', '\\${')
script_content_clean = script_content_clean.replace('`', '\\`').replace('${', '\\${')

tsx_code = f"""
import React from 'react';

export default async function {component_name}() {{
  
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

os.makedirs(output_dir, exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(tsx_code)

print(f"Created {output_file} successfully.")
