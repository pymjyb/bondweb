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

### 📧 Institution Request Form

Users can request to add new institutions through a form at `/request-institution`. 

**Setup Instructions:**

1. **Sign up for Formspree** (free tier available):
   - Go to https://formspree.io/ and create an account
   - Create a new form and get your Form ID

2. **Configure GitHub Secrets**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add secret: `VITE_FORMSPREE_ID` = your Formspree form ID
   - Add secret: `VITE_ADMIN_EMAIL` = pymjyb@gmail.com

3. **Configure Formspree**:
   - In Formspree dashboard, set your email address to receive submissions
   - Enable "Auto-responder" to send confirmation emails to requesters
   - Set reply-to to use requester's email

4. **Deploy**: The workflow will automatically use these secrets during build

**Note:** The email address is stored as a GitHub Secret and is NOT visible in the source code or built files.

For detailed setup instructions, see `README_EMAIL_SETUP.md`.

---

### 🔐 Admin Password Protection

The admin page is protected with a password. To change the password:

1. Open `src/utils/auth.ts`
2. Find the line: `const ADMIN_PASSWORD = 'admin123';`
3. Change `'admin123'` to your desired password
4. Rebuild and redeploy

**Security Notes:**
- This is client-side password protection (not highly secure)
- Password is stored in the code, so anyone with access to the source code can see it
- Session expires after 24 hours
- For production use, consider implementing server-side authentication

**Default Password:** `admin123` (change this immediately!)

---

### 🎨 Design

> Professional. Clean. Trust-oriented.  
> Minimal color, maximum readability — think "Bloomberg meets open data."  
> Uses spacing and typography to convey clarity and authority.
