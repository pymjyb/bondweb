# Email Setup for Institution Request Form

The request form needs to be configured to send emails. Here are two options:

## Option 1: Formspree (Recommended - Easiest)

1. **Sign up for Formspree** (free tier available):
   - Go to https://formspree.io/
   - Create an account
   - Create a new form

2. **Get your Form ID**:
   - After creating the form, you'll get a Form ID (e.g., `xqwerty123`)
   - Copy this ID

3. **Configure environment variables**:
   - Create a `.env` file in the root directory
   - Add: `VITE_FORMSPREE_ID=xqwerty123`
   - Add: `VITE_ADMIN_EMAIL=pymjyb@gmail.com`

4. **Configure Formspree**:
   - In Formspree settings, set up email notifications
   - Enable "Reply-To" to use requester's email
   - Configure auto-reply (confirmation email) to requester

5. **Rebuild and deploy**:
   ```bash
   npm run build
   git add .
   git commit -m "Configure email service"
   git push
   ```

**Note:** The email address is stored in `.env` which is NOT committed to git (it's in `.gitignore`). You'll need to set it as a GitHub Secret for GitHub Actions.

## Option 2: Serverless Function (More Control)

1. **Create a serverless function**:
   - Use Vercel, Netlify Functions, or AWS Lambda
   - See `api/send-email.js` for a template
   - Configure your email service (SendGrid, Mailgun, etc.)

2. **Set environment variables**:
   - In your serverless platform, set `ADMIN_EMAIL=pymjyb@gmail.com`
   - Get your function URL

3. **Configure the app**:
   - Create `.env` file: `VITE_EMAIL_API_URL=https://your-function-url.com/api/send-email`
   - Rebuild and deploy

## Setting Environment Variables for GitHub Pages

Since GitHub Pages doesn't support server-side environment variables, you have two options:

### Option A: Use GitHub Secrets (for GitHub Actions)
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `VITE_FORMSPREE_ID` = your Formspree form ID
   - `VITE_ADMIN_EMAIL` = pymjyb@gmail.com
3. Update `.github/workflows/deploy.yml` to inject these as build-time variables

### Option B: Use Vite's built-in env (build-time only)
Update `.github/workflows/deploy.yml`:
```yaml
- run: npm run build
  env:
    VITE_FORMSPREE_ID: ${{ secrets.VITE_FORMSPREE_ID }}
    VITE_ADMIN_EMAIL: ${{ secrets.VITE_ADMIN_EMAIL }}
```

## Important Notes

- **Email Privacy**: The admin email is stored in environment variables, not in the source code
- **Confirmation Emails**: Formspree can send automatic confirmation emails to requesters
- **Rate Limiting**: Free tiers usually have rate limits (e.g., 50 submissions/month for Formspree)
- **Production**: For production, consider using a paid service or serverless function for better reliability

