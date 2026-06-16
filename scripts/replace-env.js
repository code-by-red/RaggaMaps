const fs = require('fs');
const path = require('path');

// Copy config.js.example to config.js if config.js doesn't exist
const configExamplePath = path.join(__dirname, '../public/config.js.example');
const configPath = path.join(__dirname, '../public/config.js');

if (!fs.existsSync(configPath)) {
    fs.copyFileSync(configExamplePath, configPath);
}

// Read the config.js file
let configContent = fs.readFileSync(configPath, 'utf8');

// Get the APP_SCRIPT_URL from environment variables
const appScriptUrl = process.env.APP_SCRIPT_URL;

if (appScriptUrl) {
    // Replace the placeholder with the actual value
    configContent = configContent.replace(
        /APP_SCRIPT_URL: 'https:\/\/script\.google\.com\/macros\/s\/YOUR_SCRIPT_ID\/exec'/,
        `APP_SCRIPT_URL: '${appScriptUrl}'`
    );
    
    console.log('Environment variables replaced successfully in config.js');
    console.log('APP_SCRIPT_URL: ***CONFIGURED***');
} else {
    console.log('APP_SCRIPT_URL: NOT CONFIGURED - using placeholder');
}

// Write the updated content back to config.js
fs.writeFileSync(configPath, configContent);
