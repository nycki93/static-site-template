const fs = require('node:fs');
const md = require('markdown-it')();

const plugins = {
    echo: (str) => str,
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

function renderPlugins(body) {
    const pluginEval = makePluginEval(plugins);
    const matches = body.matchAll(/{{(.*?)}}/g);
    const literals = body.split(/{{.*?}}/);
    const newBody = [];
    for (const m of matches) {
        newBody.push(literals.shift());
        newBody.push(pluginEval(m[1]));
    }
    newBody.push(literals.shift());
    return newBody.join('');
}

function main() {
    fs.mkdirSync('site', { recursive: true });

    // index.html
    body = fs.readFileSync('source/index.md', 'utf-8');
    body = renderPlugins(body);
    body = [
        '<!DOCTYPE html><html><head>',
        '<title>Website Name</title>',
        '<link rel="stylesheet" href="style.css">',
        '</head><body>',
        md.render(body).trimEnd(),
        '</body></html>',    
    ].join('\n');
    fs.writeFileSync('site/index.html', body);

    // style.css
    fs.copyFileSync('source/style.css', 'site/style.css');
}

main();