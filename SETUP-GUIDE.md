# 🚀 SETUP GUIDE - Step by Step

Follow these steps exactly to get your Bookmark Manager running.

## ⏱️ Total Time: ~15 minutes

---

## STEP 1: Install Dependencies (2 minutes)

Open your terminal in the `bookmark-manager` folder:

```bash
npm install
```

Wait for all packages to install. You should see a success message.

---

## STEP 2: Supabase Setup (5 minutes)

### 2.1 Create Supabase Project

1. Go to **https://supabase.com**
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the form:
   - **Organization:** Select or create one
   - **Name:** `bookmark-manager`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your location
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes while project initializes

### 2.2 Run Database Setup

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"** button
3. Open the file `supabase-setup.sql` from your project folder
4. Copy **ALL** the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** button
7. ✅ You should see: **"Success. No rows returned"**

### 2.3 Get Your API Keys

1. Click **"Project Settings"** (⚙️ gear icon at bottom left)
2. Click **"API"** tab
3. Find and copy these two values:

   **Project URL:**
   ```
   https://abcdefghijklmnop.supabase.co
   ```
   
   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. 📝 Save these somewhere - you'll need them soon!

---

## STEP 3: Google OAuth Setup (5 minutes)

### 3.1 Create Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click **"New Project"**
5. Name: `Bookmark Manager`
6. Click **"Create"**
7. ⏳ Wait a few seconds for project creation

### 3.2 Configure Consent Screen

1. In the left menu, go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** user type
3. Click **"Create"**
4. Fill in the form:
   - **App name:** `Bookmark Manager`
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **"Save and Continue"**
6. Click **"Save and Continue"** on Scopes screen (leave default)
7. Click **"Save and Continue"** on Test users screen
8. Click **"Back to Dashboard"**

### 3.3 Create OAuth Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. Name: `Bookmark Manager Web Client`
5. Under **"Authorized redirect URIs"**, click **"Add URI"**
6. Enter (replace YOUR-PROJECT-ID with your actual Supabase project ID):
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
   
   **How to find YOUR-PROJECT-ID:**
   - Look at your Supabase Project URL
   - Example: `https://abcdefg.supabase.co` → Project ID is `abcdefg`

7. Click **"Create"**
8. A popup appears with your credentials
9. 📝 **Copy and save:**
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abcdefg`)

### 3.4 Enable Google Auth in Supabase

1. Go back to your **Supabase dashboard**
2. Click **"Authentication"** (left sidebar)
3. Click **"Providers"** tab
4. Find **"Google"** in the list
5. Click to expand it
6. Toggle **"Enable Sign in with Google"** to ON
7. Paste your **Client ID**
8. Paste your **Client Secret**
9. Click **"Save"**

---

## STEP 4: Configure Environment Variables (1 minute)

1. In your project folder, find `.env.local.example`
2. Make a copy and rename it to `.env.local`
3. Open `.env.local` in a text editor
4. Replace the placeholder values with your actual values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

5. Save the file

---

## STEP 5: Test Locally (2 minutes)

1. In terminal, run:
   ```bash
   npm run dev
   ```

2. Open your browser to: **http://localhost:3000**

3. You should see the sign-in page

4. Click **"Sign in with Google"**

5. Choose your Google account

6. ✅ You should be redirected back to the app, signed in!

7. **Test the app:**
   - Add a bookmark (any URL and title)
   - Open the app in another browser tab
   - Add another bookmark
   - ✅ Both bookmarks should appear in both tabs instantly!
   - Delete a bookmark
   - ✅ It should disappear from both tabs

---

## STEP 6: Deploy to Vercel (5 minutes)

### 6.1 Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   ```

2. Add all files:
   ```bash
   git add .
   ```

3. Commit:
   ```bash
   git commit -m "Initial commit: Bookmark Manager"
   ```

4. Create a repository on **GitHub.com**:
   - Go to https://github.com/new
   - Repository name: `bookmark-manager`
   - Keep it private or public (your choice)
   - Don't add README, gitignore, or license (we have these)
   - Click **"Create repository"**

5. Push to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/bookmark-manager.git
   git push -u origin main
   ```

### 6.2 Deploy on Vercel

1. Go to **https://vercel.com**
2. Sign up or log in (you can use your GitHub account)
3. Click **"Add New..."** > **"Project"**
4. Click **"Import"** next to your `bookmark-manager` repository
5. Click **"Import"** again to confirm
6. In the **Configure Project** screen:
   - Framework Preset: Should auto-detect as **"Next.js"**
   - Root Directory: Leave as `./`
   - Build Settings: Leave defaults
   - **Environment Variables:** Click to expand
     - Add variable 1:
       - Name: `NEXT_PUBLIC_SUPABASE_URL`
       - Value: Your Supabase URL
     - Add variable 2:
       - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
       - Value: Your Supabase anon key
7. Click **"Deploy"**
8. ⏳ Wait 2-3 minutes for build and deployment
9. ✅ You'll see a success screen with your live URL!

### 6.3 Update Google OAuth for Production

1. Copy your Vercel deployment URL
   - Example: `https://bookmark-manager-abc123.vercel.app`

2. Go back to **Google Cloud Console**

3. Go to **"APIs & Services"** > **"Credentials"**

4. Click on your OAuth 2.0 Client ID

5. Under **"Authorized redirect URIs"**, click **"Add URI"**

6. Add your Vercel URL with the callback path:
   ```
   https://your-app.vercel.app/auth/callback
   ```
   (Replace `your-app.vercel.app` with your actual Vercel domain)

7. Click **"Save"**

---

## STEP 7: Test Production (1 minute)

1. Visit your Vercel deployment URL
2. Click **"Sign in with Google"**
3. Sign in with your Google account
4. ✅ You should be redirected back, signed in!
5. Add a few bookmarks
6. Test deletion
7. Open in another device or browser
8. ✅ Verify real-time sync works!

---

## 🎉 SUCCESS!

Your Bookmark Manager is now:
- ✅ Running locally
- ✅ Deployed to production
- ✅ Fully functional with Google OAuth
- ✅ Real-time syncing across devices

---

## 📋 Verification Checklist

Go through this checklist to make sure everything works:

- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Local app opens at http://localhost:3000
- [ ] Google sign-in works locally
- [ ] Can add bookmarks locally
- [ ] Real-time sync works (test in two tabs)
- [ ] Can delete bookmarks
- [ ] Each user sees only their own bookmarks
- [ ] Code pushed to GitHub successfully
- [ ] Vercel deployment completed
- [ ] Production app is accessible
- [ ] Google sign-in works in production
- [ ] All features work in production

---

## 🆘 Common Issues

**Issue:** "redirect_uri_mismatch" error when signing in

**Fix:** 
- Double-check your Google OAuth redirect URIs
- They should be:
  - `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
  - `https://your-app.vercel.app/auth/callback`
- No trailing slashes!

---

**Issue:** Bookmarks not saving

**Fix:**
- Go to Supabase > Authentication > Policies
- Make sure you see policies for the bookmarks table
- If not, re-run `supabase-setup.sql`

---

**Issue:** Real-time not working

**Fix:**
- In Supabase SQL Editor, run:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
  ```

---

**Issue:** Environment variables not working on Vercel

**Fix:**
- Go to Vercel project settings
- Check that environment variables are added
- Make sure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables

---

## 🎓 What You Built

You now have a professional, production-ready bookmark manager with:

- Modern tech stack (Next.js 14, Supabase, Tailwind CSS)
- Secure authentication (Google OAuth)
- Real-time updates
- Private data (Row Level Security)
- Responsive design
- Cloud deployment (Vercel)

Great job! 🚀
