const fs = require('node:fs');
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
    fs.mkdirSync('site', { recursive: true });

    // TODO: add some sort of file discovery here

    // index.md
    let str = await ejs.renderFile('site-source/index.md');
    str = renderMarkdown(str);
    fs.writeFileSync('site/index.html', str);

    // style.css
    fs.copyFileSync('site-source/style.css', 'site/style.css');
}

main();
