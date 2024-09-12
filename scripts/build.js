const fs = require('node:fs/promises');
const md = require('markdown-it')();
const ejs = require('ejs');
const yfm = require('yaml-front-matter');

function renderMarkdown(str) {
    const data = yfm.loadFront(str);
    return [
        '<!DOCTYPE html><html><head>',
        `<title>${data.title}</title>`,
        '<link rel="stylesheet" href="style.css">',
        '</head><body>',
        md.render(data.__content).trimEnd(),
        '</body></html>',    
    ].join('\n');
}

async function main() {
    // TODO: add some sort of file discovery here
    const paths = ['_header.md', 'index.md', 'page2.md', 'style.css'];

    for (const path of paths) {
        if (path.startsWith('_')) {
            continue;
        }
        let str = await ejs.renderFile(`site-source/${path}`);
        if (path.endsWith('.md')) {
            str = renderMarkdown(str);
            const name = path.slice(0, path.length - 3);
            const dir = (name === 'index') ? 'site' : `site/${name}`;
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(`${dir}/index.html`, str);
        } else {
            await fs.writeFile(`site/${path}`, str);
        }
    }
}

main();
