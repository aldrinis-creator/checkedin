const fs = require('fs');
const https = require('https');
const path = require('path');

const baseUrl = 'https://senior-health-guardian.deploypad.app';
const destDir = path.join(__dirname, 'assets');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

https.get(baseUrl + '/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        const cssMatch = html.match(/href="(\/assets\/index-[^"]+\.css)"/);
        
        if (!jsMatch || !cssMatch) {
            console.error('Could not find assets in HTML!');
            return;
        }
        
        const jsUrl = baseUrl + jsMatch[1];
        const cssUrl = baseUrl + cssMatch[1];
        const jsFile = path.basename(jsMatch[1]);
        const cssFile = path.basename(cssMatch[1]);
        
        console.log(`Downloading JS: ${jsFile}`);
        https.get(jsUrl, (r) => {
            let data = '';
            r.on('data', c => data += c);
            r.on('end', () => {
                fs.writeFileSync(path.join(destDir, jsFile), data);
                console.log('Successfully downloaded JS bundle!');
            });
        });

        console.log(`Downloading CSS: ${cssFile}`);
        https.get(cssUrl, (r) => {
            let data = '';
            r.on('data', c => data += c);
            r.on('end', () => {
                let newCss = data
                    .replace(/#0ea5e9/gi, '#0070c9')
                    .replace(/#0284c7/gi, '#005ea6')
                    .replace(/14 165 233/g, '0 112 201')
                    .replace(/14,\s*165,\s*233/g, '0, 112, 201');
                
                fs.writeFileSync(path.join(destDir, cssFile), newCss);
                console.log('Successfully downloaded and patched CSS bundle!');
            });
        });
        
        // Auto-update index.html and ccrm.html
        ['index.html', 'ccrm.html'].forEach(file => {
            let content = fs.readFileSync(file, 'utf8');
            content = content.replace(/src="\.\/assets\/index-[^"]+\.js"/g, `src="./assets/${jsFile}"`);
            content = content.replace(/href="\.\/assets\/index-[^"]+\.css"/g, `href="./assets/${cssFile}"`);
            fs.writeFileSync(file, content);
            console.log(`Updated ${file}`);
        });
    });
}).on('error', (err) => console.error(err));
