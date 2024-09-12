const fs = require('node:fs');
const md = require('markdown-it')();

const plugins = {
    greet: (str) => `hello, ${str}!`,
}

function makePluginEval(plugins) {
    const code = [];
    for (const k of Object.keys(plugins)) {
        code.push(`var ${k} = this.${k};`);
    }
    code.push(`return (str) => eval(str);`);
    const fn = new Function(code.join('\n'));
    return fn.call(plugins);
}

function renderPlugins(str) {
    const pluginEval = makePluginEval(plugins);
    const matches = str.matchAll(/{{(.*?)}}/g);
    const literals = str.split(/{{.*?}}/);
    const newBody = [];
    for (const m of matches) {
        newBody.push(literals.shift());
        newBody.push(pluginEval(m[1]));
    }
    newBody.push(literals.shift());
    return newBody.join('');
}

function renderMarkdown(str) {
    return [
        '<!DOCTYPE html><html><head>',
        '<title>Website Name</title>',
        '<link rel="stylesheet" href="style.css">',
        '</head><body>',
        md.render(str).trimEnd(),
        '</body></html>',    
    ].join('\n');
}

function main() {
    fs.mkdirSync('site', { recursive: true });

    // TODO: add some sort of file discovery here

    // index.md
    let str = fs.readFileSync('source/index.md', 'utf-8');
    str = renderPlugins(str);
    str = renderMarkdown(str);
    fs.writeFileSync('site/index.html', str);

    // style.css
    fs.copyFileSync('source/style.css', 'site/style.css');
}

main();