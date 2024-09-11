const fs = require('node:fs');
const md = require('markdown-it')();
const ejs = require('ejs');

function unescapeHtml(text) {
    return (text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
    );
}

function renderMarkdown(filename) {
    let body = fs.readFileSync(`${__dirname}/source/${filename}`, 'utf-8');
    body = md.render(body).trimEnd();
    body = unescapeHtml(body);
    const match = body.match(/^<p>(.*)<\/p>$/);
    if (match) {
        body = match[1];
    }
    body = ejs.render(body);
    return body;
}

function main() {
    fs.mkdirSync('site', { recursive: true });

    // index.html
    body = fs.readFileSync('source/index.md', 'utf-8');
    body = [
        '<!DOCTYPE html><html><head>',
        '<title>Website Name</title>',
        '<link rel="stylesheet" href="style.css">',
        '</head><body>',
        md.render(body).trimEnd(),
        '</body></html>',    
    ].join('\n');
    body = unescapeHtml(body);
    body = ejs.render(body, { renderMarkdown });
    fs.writeFileSync('site/index.html', body);

    // style.css
    fs.copyFileSync('source/style.css', 'site/style.css');
}

main();