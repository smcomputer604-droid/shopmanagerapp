# 🚀 GitHub Pages Deployment Guide - ShopFlow

## Complete Guide to Deploy ShopFlow on GitHub Pages

---

## 📋 What You'll Need

- GitHub account (free)
- All ShopFlow files
- 10 minutes of your time

---

## 🎯 Step-by-Step Deployment

### **Step 1: Create GitHub Repository**

1. **Go to GitHub**: https://github.com
2. **Sign in** or **Sign up** (it's free!)
3. **Click** the `+` icon in top-right → **New repository**
4. **Repository settings:**
   - **Name**: `shopflow` (or any name you like)
   - **Description**: "Shop Management System"
   - **Public** (required for free GitHub Pages)
   - ✅ **Initialize with README** (optional)
5. **Click** "Create repository"

---

### **Step 2: Upload Your Files**

#### **Option A: Via Web Interface (Easiest)**

1. In your repository, click **"Add file"** → **"Upload files"**

2. **Drag and drop** ALL these files:
   ```
   index.html
   daily-report.html
   monthly-report.html
   profit-report.html
   customer-history.html
   style.css
   sidebar-enhancements.css
   mobile-fixes.css  ⭐ NEW
   script.js
   README.md
   QUICK_START.md
   ```

3. For **subfolders** (like invoice/):
   - Click **"Create new file"**
   - Type: `invoice/index.html` (the `/` creates the folder)
   - Paste the file content
   - Click **"Commit new file"**
   - Repeat for all files in subfolder

4. **Commit changes**: At bottom, write "Initial commit" → **Commit changes**

#### **Option B: Via Git Command Line**

```bash
# On your computer
cd /path/to/your/shopflow/files

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/shopflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### **Step 3: Handle Subfolders**

If you have an `invoice/` folder with files:

#### **Structure Should Look Like:**
```
shopflow/
├── index.html
├── daily-report.html
├── monthly-report.html
├── profit-report.html
├── customer-history.html
├── style.css
├── sidebar-enhancements.css
├── mobile-fixes.css
├── script.js
├── README.md
└── invoice/
    ├── index.html
    ├── style.css
    └── script.js
```

#### **To Upload Subfolder via Web:**

1. Click **"Add file"** → **"Create new file"**
2. **File name**: `invoice/index.html`
   - The `/` automatically creates the folder!
3. **Paste** the invoice content
4. **Commit** the file
5. **Repeat** for other files in invoice folder

#### **Via Command Line:**

```bash
# Just commit everything including subfolders
git add invoice/
git commit -m "Add invoice subfolder"
git push
```

---

### **Step 4: Enable GitHub Pages**

1. **Go to** your repository settings (Settings tab)
2. **Scroll down** to **"Pages"** in left sidebar
3. **Source**: Select **"main"** branch
4. **Folder**: Select **"/ (root)"**
5. **Click** "Save"
6. **Wait** 1-2 minutes for deployment
7. **Your URL**: `https://YOUR_USERNAME.github.io/shopflow/`

---

### **Step 5: Test on Mobile**

1. **Open URL** on your phone browser
2. **Test**:
   - ✅ Click on service cards (should open modal)
   - ✅ Enter amount and submit
   - ✅ Check if data saves
   - ✅ Try all features
3. **Add to Home Screen**:
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home screen

---

## 🔧 Fixing Mobile Issues

### **Problem: Service Cards Not Clickable**

**Solution**: Make sure `mobile-fixes.css` is uploaded and linked

Add to `index.html` head:
```html
<link rel="stylesheet" href="mobile-fixes.css">
```

### **Problem: Modal Not Opening**

**Check:**
1. Browser console (F12 or inspect element)
2. Check if `script.js` is loaded
3. Verify file paths are correct

**Fix**: All files must be in root or proper subfolders

### **Problem: Subfolder Links Broken**

**Issue**: Link says `<a href="invoice/index.html">`

**Solution**: Update to relative path:
```html
<!-- If in root, link to subfolder: -->
<a href="invoice/index.html">Invoice</a>

<!-- If in subfolder, link to root: -->
<a href="../index.html">Home</a>
```

---

## 📁 File Path Reference

### **Root Files (Main Directory)**
```
/index.html              → Main dashboard
/daily-report.html       → Reports
/monthly-report.html
/profit-report.html
/customer-history.html
/style.css               → Styles
/sidebar-enhancements.css
/mobile-fixes.css        → Mobile fixes ⭐
/script.js               → Functionality
```

### **Subfolder Files**
```
/invoice/index.html      → Invoice generator
/invoice/style.css       → Invoice styles (if separate)
/invoice/script.js       → Invoice logic (if separate)
```

### **Links in HTML**

From `index.html` (root) to subfolder:
```html
<a href="invoice/index.html">Generate Invoice</a>
```

From `invoice/index.html` (subfolder) to root:
```html
<a href="../index.html">Back to Dashboard</a>
<link rel="stylesheet" href="../style.css">
<script src="../script.js"></script>
```

---

## 🔄 Updating Files

### **Via Web Interface:**

1. **Navigate** to file in repository
2. **Click** pencil icon (Edit)
3. **Make changes**
4. **Commit** changes
5. **Wait** ~30 seconds for GitHub Pages to update

### **Via Git:**

```bash
# Make changes to files
# Then:
git add .
git commit -m "Updated features"
git push
```

---

## 🎨 Customization Before Deployment

### **Update Company Name:**

In `index.html`, find and update:
```html
<h1 class="sname">SM PRINT TECHNOLOGY</h1>
```

### **Add Your Logo:**

1. **Upload** `mylogo.png` to repository
2. **Uncomment** logo section in `index.html`:
```html
<div class="logo">
    <img src="mylogo.png" alt="Logo">
    <div class="logo-text">SM PRINT</div>
</div>
```

### **Change Colors:**

Edit `style.css`:
```css
:root {
    --primary-color: #667eea;  /* Change this */
    --primary-light: #764ba2;  /* And this */
}
```

---

## 📱 Mobile PWA Setup

### **Add manifest.json** (Optional)

Create `manifest.json` in root:
```json
{
  "name": "SM PRINT TECHNOLOGY",
  "short_name": "ShopFlow",
  "start_url": "/shopflow/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `index.html` head:
```html
<link rel="manifest" href="manifest.json">
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] All HTML files uploaded
- [ ] All CSS files uploaded (including mobile-fixes.css)
- [ ] All JS files uploaded
- [ ] Subfolders properly structured
- [ ] GitHub Pages enabled
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] Service cards clickable on mobile
- [ ] Modals open properly
- [ ] Data saves correctly
- [ ] Logo added (optional)
- [ ] Company name updated

---

## 🐛 Common Issues & Solutions

### **Issue**: Files not found (404 error)

**Solution**: 
- Check file names (case-sensitive!)
- Verify folder structure
- Wait 30 seconds after upload

### **Issue**: Mobile modal not working

**Solution**:
- Add `mobile-fixes.css`
- Check viewport meta tag
- Test in incognito mode

### **Issue**: Subfolder files not loading

**Solution**:
- Use relative paths (`../style.css`)
- Check folder structure
- Verify file links

### **Issue**: GitHub Pages not enabled

**Solution**:
- Repository must be Public
- Enable in Settings → Pages
- Select main branch
- Wait 1-2 minutes

---

## 🔐 Using Custom Domain (Optional)

If you own a domain:

1. **In DNS settings**, add CNAME record:
   ```
   www  →  YOUR_USERNAME.github.io
   ```

2. **In GitHub** Settings → Pages:
   - **Custom domain**: www.yourdomain.com
   - **Enforce HTTPS**: ✅ Enable

3. **Wait** for DNS propagation (5-30 min)

---

## 📊 File Organization Example

```
shopflow/                      # Repository
│
├── index.html                 # Main dashboard
├── daily-report.html          
├── monthly-report.html        
├── profit-report.html         
├── customer-history.html      
│
├── style.css                  # Main styles
├── sidebar-enhancements.css   # Sidebar styles
├── mobile-fixes.css           # Mobile responsive ⭐
│
├── script.js                  # Main functionality
│
├── README.md                  # Documentation
├── QUICK_START.md             
│
├── manifest.json              # PWA config (optional)
├── icon-192.png               # App icon (optional)
├── icon-512.png               # App icon (optional)
├── mylogo.png                 # Your logo (optional)
│
└── invoice/                   # Subfolder
    ├── index.html            
    ├── style.css             # Invoice-specific styles
    └── script.js             # Invoice-specific logic
```

---

## 🎯 Quick Commands Reference

### **Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/shopflow.git
```

### **Add Files**
```bash
git add .
git commit -m "Description of changes"
git push
```

### **Create Branch**
```bash
git checkout -b feature-name
git push -u origin feature-name
```

### **Pull Updates**
```bash
git pull origin main
```

---

## 🆘 Getting Help

### **GitHub Issues:**
- File paths: Check case sensitivity
- 404 errors: Verify file exists in repository
- Mobile issues: Check mobile-fixes.css is loaded

### **Test Deployment:**
```
1. Upload one file (index.html)
2. Enable GitHub Pages
3. Test access
4. Upload rest of files
5. Test again
```

---

## 🎉 You're Done!

Your ShopFlow is now live on GitHub Pages!

**Access**: `https://YOUR_USERNAME.github.io/shopflow/`

**Next Steps**:
1. Test on mobile
2. Add to home screen
3. Configure Google Sheets
4. Start using!

---

**Questions?** Check GitHub's own documentation:
- https://docs.github.com/pages

**Happy Deploying! 🚀**
