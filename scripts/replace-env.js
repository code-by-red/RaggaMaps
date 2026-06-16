const fs = require('fs');
const path = require('path');

// Get environment variables
const appScriptUrl = process.env.APP_SCRIPT_URL || '';
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '';

// Create config.js content
const configContent = `
const CONFIG = {
    APP_SCRIPT_URL: '${appScriptUrl}',
    GOOGLE_SHEETS: {
        SPREADSHEET_ID: '${spreadsheetId}',
        SHEET_NAME: 'dados',
        RANGE: 'dados!A:J'
    }
};

window.CONFIG = CONFIG;
`;

// Write config.js
const configPath = path.join(__dirname, '../public/config.js');
fs.writeFileSync(configPath, configContent);

console.log('config.js generated successfully');
console.log('APP_SCRIPT_URL:', appScriptUrl ? '***CONFIGURED***' : 'NOT CONFIGURED');
console.log('GOOGLE_SPREADSHEET_ID:', spreadsheetId ? '***CONFIGURED***' : 'NOT CONFIGURED');
