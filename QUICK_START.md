# 🚀 Quick Setup Guide - ShopFlow Enhanced

## 5-Minute Setup

### Step 1: Google Sheets Setup (2 minutes)

1. Go to https://sheets.google.com
2. Create new spreadsheet named "ShopFlow Database"
3. Copy the ID from URL: 
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit
   ```

### Step 2: Apps Script Deployment (2 minutes)

1. In Google Sheet: **Extensions > Apps Script**
2. Delete existing code
3. Paste contents of `code.gs`
4. Line 7: Replace with your Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_ID_HERE';
   ```
5. Click **Deploy > New Deployment**
6. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Access: **Anyone**
7. Click **Deploy** → **Authorize** → **Allow**
8. Copy the **Web app URL**

### Step 3: Configure ShopFlow (1 minute)

1. Open `index.html` in browser
2. Click **Settings** in sidebar
3. Paste your Web app URL
4. Click **Test Connection**
5. Set sync interval (optional)
6. Click **Save Settings**

### ✅ Done! Start using ShopFlow

Make a test sale to verify everything works!

---

## File Structure

```
shopflow/
├── index.html              # Main dashboard
├── daily-report.html       # Daily sales report
├── monthly-report.html     # Monthly overview
├── profit-report.html      # Profit analysis (NEW)
├── invoice.html            # Invoice generator (NEW)
├── customer-history.html   # Customer tracking (NEW)
├── style.css              # All styles
├── script.js              # Main functionality
├── code.gs                # Google Apps Script
├── mylogo.png             # Your logo (add this)
└── README.md              # Full documentation
```

---

## Essential Features

### 💰 Sales Entry
1. Select date
2. Click service
3. Enter amount
4. Add customer (optional)
5. Submit

### 📊 View Reports
- **Daily**: Click "Daily Report" in sidebar
- **Monthly**: Click "Monthly Report" in sidebar
- **Profit**: Click "Profit Report" in sidebar

### 📝 Generate Invoice
1. Click "Generate Invoice"
2. Fill customer info
3. Add items
4. Generate & Print

### 🌙 Toggle Dark Mode
- Click "Dark Mode" button in sidebar

### 🔄 Sync Data
- **Auto**: Set in Settings
- **Manual**: Click "Sync Now" in sidebar

---

## Quick Troubleshooting

**Can't connect to Google Sheets?**
- Open Web app URL in browser first
- Click "Allow" when prompted
- Re-copy URL to Settings

**Data not syncing?**
- Click "Test Connection"
- Try manual "Sync Now"
- Check internet connection

**Reports empty?**
- Make sure you entered some sales
- Check the selected date
- Refresh the page

---

## Need More Help?

See `README.md` for:
- Detailed installation guide
- Complete feature documentation
- Advanced troubleshooting
- Tips & best practices

---

**Happy selling! 🎉**
