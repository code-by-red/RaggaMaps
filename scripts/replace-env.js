const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, '../public/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Get environment variables
const appScriptUrl = process.env.APP_SCRIPT_URL || '';
const spreadsheetId = process.env.SPREADSHEET_ID || '';

// Replace placeholders with environment variables
if (appScriptUrl) {
    indexContent = indexContent.replace(/%%APP_SCRIPT_URL%%/g, appScriptUrl);
    console.log('APP_SCRIPT_URL: ***CONFIGURED***');
} else {
    console.log('APP_SCRIPT_URL: NOT CONFIGURED');
}

if (spreadsheetId) {
    indexContent = indexContent.replace(/%%SPREADSHEET_ID%%/g, spreadsheetId);
    console.log('SPREADSHEET_ID: ***CONFIGURED***');
} else {
    console.log('SPREADSHEET_ID: NOT CONFIGURED');
}

// Write the updated content back to index.html
fs.writeFileSync(indexPath, indexContent);

console.log('Environment variables replaced successfully in index.html');
