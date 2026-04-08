const fs = require('fs');

const code = fs.readFileSync('assets/index-BzkBeHcr.js', 'utf8');

const stringsToFind = [
    'Choose Your Plan',
    'Free',
    '₹99',
    '₹199',
    'SOS Emergency Alert',
    'Basic Activity Tracking',
    'Everything in Free'
];

stringsToFind.forEach(str => {
    let index = code.indexOf(str);
    console.log(`Contains "${str}":`, index !== -1);
    if (index !== -1) {
        console.log('  Context:', code.substring(Math.max(0, index - 50), index + 100));
    }
});
