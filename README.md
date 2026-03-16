# StrideFlow™ - Vercel Deployment Guide

## Quick Deploy (10 minutes)

### Step 1: Download Files
You have 3 files to deploy:
- `index.html` - Landing page (NEW)
- `assessment.html` - The assessment tool (renamed from old index.html)
- `assessment.js` - The application logic

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `strideflow-fabric-assessment`
3. Description: "Enterprise Agentic Readiness Assessment Tool"
4. Select: **Public** (or Private if you have Pro)
5. Click "Create repository"

### Step 3: Upload Files to GitHub

**Option A: Via GitHub Web Interface** (Easiest)
1. On your new repository page, click "uploading an existing file"
2. Drag all 3 files (`index.html`, `assessment.html`, `assessment.js`) into the upload area
3. Commit message: "Add landing page and assessment"
4. Click "Commit changes"

**Option B: Via Command Line** (If you know Git)
```bash
git clone https://github.com/YOUR-USERNAME/strideflow-fabric-assessment.git
cd strideflow-fabric-assessment
# Copy index.html, assessment.html, and assessment.js into this folder
git add .
git commit -m "Add landing page and assessment"
git push
```

### Step 4: Deploy to Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "Import Project"
5. Find your `strideflow-fabric-assessment` repository
6. Click "Import"
7. Project settings:
   - Framework Preset: **Other**
   - Build Command: Leave empty
   - Output Directory: Leave empty
8. Click "Deploy"

**Wait 30-60 seconds...**

### Step 5: Get Your Live URL

Vercel will give you a URL like:
```
https://strideflow-fabric-assessment.vercel.app
```

**This is your shareable link!** ✅

You can now text/WhatsApp this to your pilot group.

---

## Add Custom Domain (Later - Optional)

### When you register strideflow.com:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add domain: `strideflow.com` or `fabric.strideflow.com`
4. Vercel gives you DNS settings
5. Update DNS at your domain registrar (Namecheap, GoDaddy, etc.)
6. Wait 10-60 minutes for DNS propagation

**Both URLs will work:**
- `strideflow-fabric-assessment.vercel.app` (original)
- `strideflow.com` (custom domain)

---

## Test Your Deployment

1. Open your Vercel URL in browser
2. ✅ You should see the StrideFlow landing page with hero section
3. ✅ Click "Assess Your Agentic Readiness" button in hero
4. ✅ You should navigate to assessment.html
5. ✅ Click "Begin Assessment" on the assessment page
6. ✅ Answer a few questions to verify the flow works
7. ✅ Complete assessment to see results
8. ✅ Test on mobile device

**Your URLs:**
- Landing page: `https://strideflow-fabric-assessment-[something].vercel.app/`
- Assessment: `https://strideflow-fabric-assessment-[something].vercel.app/assessment.html`

---

## Update the Site Later

**To make changes:**

1. Edit `index.html` (landing page), `assessment.html` (assessment tool), or `assessment.js` (logic) locally
2. Upload to GitHub (via web or git push)
3. Vercel automatically redeploys in ~30 seconds
4. No additional steps needed!

**Common updates:**
- Landing page copy/design: Edit `index.html`
- Assessment questions/flow: Edit `assessment.html` and `assessment.js`
- Scoring logic: Edit `assessment.js`

---

## Troubleshooting

**Problem: 404 Error**
- Make sure `index.html` is in the root directory (not in a subfolder)
- Check that file is named exactly `index.html` (not `Index.html`)

**Problem: JavaScript not working**
- Check browser console for errors (F12 → Console tab)
- Verify `assessment.js` uploaded correctly
- Clear browser cache and reload

**Problem: Styling broken**
- CSS is embedded in `index.html`, so if the page loads, CSS should work
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Contact Information

For questions about StrideFlow or this deployment:
- **Email**: raj@strideflow.com (update this to your email)
- **Assessment URL**: [Your Vercel URL]

---

## What You Have

**Free tier includes:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN (fast worldwide)
- ✅ Automatic builds on git push
- ✅ 100GB bandwidth/month
- ✅ Custom domain support

This is plenty for pilot testing with 10-50 users.

---

## Next Steps After Pilot

Once you get feedback:
1. Register domain (strideflow.com)
2. Add custom domain to Vercel
3. Consider adding backend for tracking (Supabase)
4. Build additional StrideFlow services (Code, Flow)

**For now: Deploy and share with your pilot group!**
