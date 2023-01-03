const fs = require('node:fs/promises');
const md = require('markdown-it')();

async function main() {
    await fs.mkdir('build', { recursive: true });
    const body_md = await fs.readFile('pages/index.md', 'utf-8');
    await fs.writeFile('build/index.html', [
        '<!DOCTYPE html>',
        '<html>',
        '<body>',
        md.render(body_md),
        '</body>',
        '</html>',    
    ].join('\n'));
}

main();