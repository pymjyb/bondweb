# GovBond Hub

A modern, responsive static website built with Vite + React + TypeScript + Tailwind CSS for exploring government bond investors and issuers. Designed for easy deployment to GitHub Pages.

## Features

- 🏠 **Landing Page** with hero section and call-to-action
- 👥 **Investors Tab** - Browse and explore institutional investors
- 🏛️ **Issuers Tab** - Explore government bond issuers
- 📄 **Detail Pages** - Comprehensive information for each investor/issuer
- 📱 **Fully Responsive** - Works seamlessly on mobile and desktop
- 📊 **CSV Data Source** - Easy to update data without code changes
- 🚀 **Static Site** - No backend required, perfect for GitHub Pages

## Project Structure

```
├── public/
│   └── data/
│       ├── investors.csv    # Investor data
│       └── issuers.csv      # Issuer data
├── src/
│   ├── components/
│   │   ├── Card.tsx         # Summary card component
│   │   ├── DetailPage.tsx   # Detail page component
│   │   ├── ListPage.tsx     # List page component
│   │   └── Navbar.tsx       # Navigation component
│   ├── pages/
│   │   └── Landing.tsx      # Landing page
│   ├── utils/
│   │   └── csvParser.ts     # CSV parsing utility
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   ├── types.ts             # TypeScript type definitions
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cursortest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Data Management

### CSV Format

The application reads data from CSV files located in `public/data/`:

- `investors.csv` - Investor data
- `issuers.csv` - Issuer data

### CSV Structure

Each CSV file should have the following columns:
- `id` (required) - Unique identifier used in URLs
- `name` (required) - Display name
- `description` - Brief description
- `image` (optional) - URL to image/icon
- `keyData` (optional) - Key statistics or data
- `contact` (optional) - Contact information
- `link` (optional) - Website URL

### Example CSV Entry

```csv
id,name,description,image,keyData,contact,link
blackrock,BlackRock Inc.,One of the world's largest asset management firms,,Assets under management: $10 trillion+,contact@blackrock.com,https://www.blackrock.com
```

**Note:** To update data, simply edit the CSV files in `public/data/` and redeploy. No code changes required!

## Building for Production

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment to GitHub Pages

### Option 1: Using gh-pages (Recommended)

1. Install gh-pages (if not already installed):
```bash
npm install --save-dev gh-pages
```

2. Update `vite.config.ts` to set the correct `base` path:
   - If your repo name is `cursortest`, the base should be `/cursortest/`
   - If deploying to a custom domain, set base to `/`

3. Deploy:
```bash
npm run deploy
```

This will:
- Build the project
- Create/update a `gh-pages` branch
- Push the built files to GitHub

4. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch and `/ (root)` folder
   - Click Save

### Option 2: Using GitHub Actions (Alternative)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push to the main branch and the action will automatically deploy.

### Option 3: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Copy the contents of `dist/` to a `docs/` folder in your repository root

3. Enable GitHub Pages:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/docs` folder
   - Click Save

**Important:** If using this method, update `vite.config.ts` to set `base: '/'` (not `/cursortest/`)

## Customization

### Updating the Base Path

If your repository name differs from `cursortest`, update the `base` field in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
  // ...
})
```

### Styling

The project uses Tailwind CSS. Customize colors, spacing, and typography in `tailwind.config.js`.

### Adding New Fields

To add new fields to the detail pages:

1. Add the column to your CSV files
2. Update the `DetailPage.tsx` component to display the new field

## Technologies Used

- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

