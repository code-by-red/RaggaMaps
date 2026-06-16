# ReggaeMap 🎵

SaaS platform for discovering reggae events and locations on an interactive map.

## 📁 Project Structure

```
RaggaMaps/
├── public/
│   ├── index.html          # Main HTML file with Tailwind CSS
│   ├── style.css           # Custom styles for map and components
│   ├── main.js             # Application logic (map, API fetch)
│   └── config.js           # Configuration file (environment variables)
├── scripts/
│   └── replace-env.js      # Build script for environment variable replacement
├── .env                    # Local environment variables (NOT committed)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── vercel.json             # Vercel deployment configuration
├── package.json            # Node.js dependencies and scripts
└── README.md               # This file
```

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RaggaMaps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google credentials**
   - Place your Google Service Account credentials in `config/google-service-account.json`
   - This file is already protected by `.gitignore` and will NOT be committed
   - The credentials file should contain your service account JSON from Google Cloud Console

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   APP_SCRIPT_URL=your_actual_apps_script_url_here
   GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
   GOOGLE_SHEET_NAME=dados
   ```

5. **Update config.js for local development**
   The `public/config.js` is already configured with your Apps Script URL and Google Sheets ID.

6. **Start local server**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.
   
   **IMPORTANT**: Always use `npm start` to run the local server. Opening `index.html` directly in the browser will cause CORS and security errors.

## 📦 Git Setup

### Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: ReggaeMap project structure"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Copy the repository URL
3. Add remote and push:

```bash
# Add remote repository
git remote add origin https://github.com/your-username/RaggaMaps.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel CLI**
   ```bash
   vercel
   ```
   Follow the prompts to deploy your project.

### Or Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration

### Configure Environment Variables in Vercel

**IMPORTANT**: For production, you must set the environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - **Name**: `APP_SCRIPT_URL`
   - **Value**: Your actual Google Apps Script URL
   - **Environment**: Select `Production`, `Preview`, and `Development`
4. Click **Save**

5. **Redeploy** to apply the environment variables:
   - Go to the **Deployments** tab
   - Click the three dots next to the latest deployment
   - Select **Redeploy`

**NOTE**: Google Service Account credentials are NOT used in Vercel production. The Google Apps Script handles the authentication with Google Sheets directly.

### How Environment Variables Work

- **Local Development**: Copy `public/config.js.example` to `public/config.js` and replace the placeholder values (note: config.js is in .gitignore)
- **Vercel Production**: The build script (`scripts/replace-env.js`) automatically replaces the placeholder with the environment variable set in Vercel
- **Security**: Your `.env` file and `public/config.js` are never committed to Git thanks to `.gitignore`

## 🔧 Configuration

### Google Apps Script Integration

The application fetches and sends event data to a Google Apps Script. To set this up:

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Copy the code from `google-apps-script-example.js` in this repository
4. Paste it in the Apps Script editor
5. Deploy as Web App:
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Description: "RaggaMaps API"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
6. Copy the Web App URL
7. Add it to your environment variables as `APP_SCRIPT_URL`

**Important:** The script must handle both GET (read) and POST (write) requests. The example script in `google-apps-script-example.js` shows the required structure.

### Adding Events

The application includes a form to add new events with:
- Event name
- Address components (street, number, neighborhood, city)
- Date of the event
- Start time (required) and end time (optional)
- Status and description
- Optional link

**Google Maps Integration:**
- Each event card includes a "Ver endereço no Google Maps" button
- Clicking opens Google Maps with the address pre-filled
- No geocoding needed - users can see the exact location on Google Maps

### Page Sections

The application includes several sections accessible via the navigation buttons:
- **Início**: Shows the events list
- **Eventos**: Displays the events list
- **Sound Systems**: Shows information about sound systems (in development)
- **Adicionar Role**: Opens a form to add new events
- **Sobre**: Displays information about the project
- **Contato**: Shows contact information

### Expected Data Format

The Google Apps Script should return JSON in this format (matching your Google Sheets columns):

```json
[
  {
    "nome": "Event Name",
    "endereco": "Street, Number - Neighborhood, City",
    "data": "2026-06-17",
    "horario_inicio": "20:00",
    "horario_fim": "04:00",
    "status": "confirmado",
    "description": "Event description",
    "link": "https://example.com"
  }
]
```

**Important:** The `data` field must be in ISO format (YYYY-MM-DD) for the automatic date filtering to work correctly. Events are automatically removed from the list the day after their date. The display format is DD/MM/YYYY for better readability.

**Google Sheets Structure:**
- Sheet name: `dados`
- Columns: `nome`, `endereco`, `data`, `horario_inicio`, `horario_fim`, `status`, `description`, `link`
- The Google Apps Script reads this sheet and returns the data as JSON
- No coordinates needed - events are displayed as cards with Google Maps integration

**Automatic Date Filtering:**
- Events with past dates are automatically filtered out
- Only current and future events are displayed in the list
- This keeps the content relevant and up-to-date
- Events disappear automatically the day after their date
- To keep old events visible, remove the date field or set a future date

## 🎨 Technologies Used

- **Frontend**: HTML5, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN for development), Custom CSS
- **Typography**: 'Oi' font for main titles only, system fonts for event cards and body text (improved readability)
- **Maps**: Google Maps integration (via links)
- **Deployment**: Vercel
- **Version Control**: Git

**Note**: Tailwind CSS is currently loaded via CDN for development convenience. For production, consider installing Tailwind CSS as a PostCSS plugin for better performance and optimization.

## 📝 Development Workflow

1. Make changes to files in the `public/` directory
2. Test locally using `npm start`
3. Commit changes: `git add . && git commit -m "description"`
4. Push to GitHub: `git push`
5. Vercel will automatically deploy

## 🔒 Security Notes

- Never commit the `.env` file
- Never commit the `config/` directory or any credentials files
- Never expose API keys or sensitive URLs in client-side code
- Use environment variables for all sensitive configuration
- The `.gitignore` file is configured to protect:
  - `.env` and `.env.*` files
  - `config/` directory (contains Google Service Account credentials)
  - All `.json` files except `package.json` and `vercel.json`
- Google Service Account credentials in `config/google-service-account.json` are NEVER committed
- In production, Vercel environment variables handle sensitive configuration

## 🐛 Troubleshooting

### "Identifier 'CONFIG' has already been declared" error
- This error occurs if `config.js` is not loaded before `main.js`
- Ensure `config.js` is loaded before `main.js` in `index.html`
- The order should be: Leaflet JS → config.js → main.js

### "Unsafe attempt to load URL file://" error
- This error occurs when opening `index.html` directly in the browser
- Always use `npm start` to run the local server
- Access the application at `http://localhost:3000`

### Tailwind CSS CDN warning
- The CDN warning is normal for development
- For production, install Tailwind CSS as a PostCSS plugin
- The CDN works fine for development and testing

### Events not displaying
- Verify `APP_SCRIPT_URL` is correctly configured
- Check browser console for errors
- Ensure Google Apps Script returns valid JSON
- Check that the Google Sheet has the correct column structure (including date and time columns)

### Form submission not working
- Ensure Google Apps Script is deployed as a Web App with "Anyone" access
- Check that the script handles POST requests (see `google-apps-script-example.js`)
- Verify the script is deployed with "Execute as: Me"
- Check browser console for CORS errors
- Try redeploying the Google Apps Script after making changes

### Environment variables not working in production
- Verify environment variables are set in Vercel dashboard
- Redeploy after adding environment variables
- Check Vercel deployment logs for build errors

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
