const fs = require('node:fs/promises');
const md = require('markdown-it')();

async function main() {
    await fs.mkdir('build', { recursive: true });

    // index.html
    const body_md = await fs.readFile('source/index.md', 'utf-8');
    await fs.writeFile('build/index.html', [
        '<!DOCTYPE html><html><head>',
        '<title>Website Name</title>',
        '<link rel="stylesheet" href="style.css">',
        '</head><body>',
        md.render(body_md).trimEnd(),
        '</body></html>',    
    ].join('\n'));

    // style.css
    await fs.copyFile('source/style.css', 'build/style.css');
}

main();