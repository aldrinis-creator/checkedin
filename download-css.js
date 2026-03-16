const fs = require('fs');
const https = require('https');
const path = require('path');

const cssUrl = 'https://senior-health-guardian.deploypad.app/assets/index-BAUHJFu0.css';
const destDir = path.join(__dirname, 'assets');
const destPath = path.join(destDir, 'index-BAUHJFu0.css');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

https.get(cssUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Replace old colors with new `#0070c9` variants
        let newCss = data
            .replace(/#0ea5e9/gi, '#0070c9')
            .replace(/#0284c7/gi, '#005ea6')
            .replace(/14 165 233/g, '0 112 201')
            .replace(/14,\s*165,\s*233/g, '0, 112, 201');
        
        fs.writeFileSync(destPath, newCss);
        console.log('Successfully downloaded and patched CSS!');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
