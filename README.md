# Finance Data Hub

A static open-source site to explore public financial institution data.  
Built with **Vite + React + Tailwind CSS**. Hosted on **GitHub Pages**.

---

## 🚀 Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` (or the port shown in your terminal).

---

## 🏗️ Build

```bash
npm run build
```

---

## 🚀 Deploy to GitHub Pages

1. **Ensure your `vite.config.ts` has the correct base path:**

```typescript
base: '/<repo-name>/'
```

2. **Create the GitHub Actions workflow file:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Push to main branch**

4. **Configure GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from branch → `gh-pages`
   - Click Save

5. **Wait ~2 minutes, then visit:**
   - `https://<username>.github.io/<repo-name>/`

---

### ✅ Features

- Landing page with hero section
- Browse institutions page with CSV data loading
- Institution detail pages
- Fully responsive design
- Professional finance/corporate styling
- Static site (no backend required)

---

### 🎨 Design

> Professional. Clean. Trust-oriented.  
> Minimal color, maximum readability — think "Bloomberg meets open data."  
> Uses spacing and typography to convey clarity and authority.
