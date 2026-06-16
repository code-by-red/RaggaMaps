const fs = require('fs');
const path = require('path');

// Read the config.js file
const configPath = path.join(__dirname, '../public/config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Get the APP_SCRIPT_URL from environment variables
const appScriptUrl = process.env.APP_SCRIPT_URL || 'YOUR_APPS_SCRIPT_URL_HERE';

// Replace the placeholder with the actual value
configContent = configContent.replace(
    /APP_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE'/,
    `APP_SCRIPT_URL: '${appScriptUrl}'`
);

// Write the updated content back to config.js
fs.writeFileSync(configPath, configContent);

console.log('Environment variables replaced successfully in config.js');
console.log('APP_SCRIPT_URL:', appScriptUrl ? '***CONFIGURED***' : 'NOT CONFIGURED');
