# 🚀 ShopFlow Enhanced v5.0.0

## Complete Shop Management System with Real-Time Sync

---

## 📋 **What's New in v5.0.0**

### ✨ **Major Features Added:**

1. **🌙 Dark Mode Toggle**
   - Beautiful dark theme with smooth transitions
   - Persists across sessions
   - Easy toggle from sidebar

2. **🔄 Real-Time Google Sheets Sync**
   - Automatic background syncing
   - Configurable sync intervals (30s, 1min, 5min)
   - Manual sync option
   - Sync status indicator
   - Multiple device support

3. **🎨 Modern Sidebar Navigation**
   - Responsive sidebar menu
   - All features easily accessible
   - Mobile-friendly with toggle
   - Active state indicators

4. **📊 New Report Types:**
   - **Profit Report**: Revenue vs Expenses analysis with charts
   - **Customer History**: Track all customer purchases and spending
   - Enhanced Daily & Monthly reports (use existing files)

5. **🔔 Smart Notifications**
   - Sales entry notifications
   - Expense entry notifications
   - Cash drawer update notifications
   - Sync status notifications
   - Success/Error/Warning alerts

6. **📝 Invoice Generator**
   - Professional invoice creation
   - Dynamic item management
   - Print-friendly format
   - Auto-calculation of totals
   - Customer information management

7. **💰 Profit Calculator**
   - Real-time profit tracking
   - Revenue vs Expenses comparison
   - Profit margin calculations
   - Daily average profits
   - Visual charts with Chart.js

8. **👥 Customer Management**
   - Customer purchase history
   - Total spending tracking
   - Transaction timeline
   - Search functionality

9. **📈 Enhanced Dashboard**
   - Live statistics cards
   - Today's sales/transactions
   - Current cash display
   - Profit overview
   - Recent activities feed

---

## 🎯 **Features Overview**

### **Dashboard (index.html)**
- Real-time sales statistics
- Quick service entry
- Cash drawer management
- Daily expenses tracking
- Recent activities feed
- Theme toggle
- Sync status

### **Daily Report**
- Date-specific sales breakdown
- Service-wise analysis
- Transaction details
- Export to CSV
- Print functionality

### **Monthly Report**
- Calendar view of sales
- Daily breakdown
- Service performance charts
- Top services ranking
- Monthly totals

### **Profit Report** ⭐ NEW
- Revenue vs Expenses charts
- Profit margin calculations
- Date range selection
- Expense breakdown
- PDF export option

### **Invoice Generator** ⭐ NEW
- Professional invoice layout
- Dynamic item addition
- Auto-calculations
- Customer details
- Print-ready format

### **Customer History** ⭐ NEW
- All customer transactions
- Search functionality
- Purchase history
- Total spending
- Last visit tracking

---

## 🛠️ **Installation Guide**

### **Step 1: Prepare Your Files**

1. Download all files:
   - `index.html`
   - `daily-report.html`
   - `monthly-report.html`
   - `profit-report.html` (NEW)
   - `invoice.html` (NEW)
   - `customer-history.html` (NEW)
   - `style.css`
   - `script.js`
   - `code.gs`

2. Add your logo:
   - Save your logo as `mylogo.png`
   - Place in the same folder as HTML files

### **Step 2: Set Up Google Sheets**

1. **Create a new Google Sheet**
   - Go to https://sheets.google.com
   - Create a new blank spreadsheet
   - Name it "ShopFlow Database"

2. **Get the Spreadsheet ID**
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
   - Copy the ID (the long string between /d/ and /edit)

3. **Set up Google Apps Script**
   - In your Google Sheet, go to **Extensions > Apps Script**
   - Delete any existing code
   - Paste the entire contents of `code.gs`
   - **IMPORTANT:** Replace `SPREADSHEET_ID` on line 7 with your actual Spreadsheet ID
   
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

4. **Deploy the Script**
   - Click **Deploy > New Deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**
   - Settings:
     - Description: "ShopFlow API"
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced > Go to ShopFlow (unsafe)**
   - Click **Allow**
   - Copy the **Web app URL** (looks like: `https://script.google.com/...`)

### **Step 3: Configure ShopFlow**

1. Open `index.html` in a web browser
2. Click the **Settings** button in the sidebar
3. Paste your **Web app URL** from Step 2
4. Click **Test Connection** to verify
5. Set your preferred **Auto-Sync Interval**
6. Click **Save Settings**

### **Step 4: Test Everything**

1. Make a test sale
2. Add a cash entry
3. Record an expense
4. Check if data appears in Google Sheets
5. View reports to verify functionality

---

## 📱 **How to Use**

### **Making a Sale**

1. Select the date (default is today)
2. Click on a service card
3. Enter the amount
4. Optionally add customer name
5. Click **Submit Sale**
6. You'll see a notification confirming the sale

### **Managing Cash**

1. Go to "Cash in Drawer" section
2. Select the date
3. Enter the cash amount
4. Click **Save Cash**
5. The current cash will update in the dashboard

### **Recording Expenses**

1. Go to "Daily Expenses" section
2. Enter the expense amount
3. Add the purpose/description
4. Click **Save Expense**
5. Expense is logged with notification

### **Generating Invoices**

1. Click **Generate Invoice** in sidebar
2. Fill in customer details
3. Add invoice items (click **Add Item** for more)
4. Click **Generate Invoice**
5. Review and click **Print**

### **Viewing Reports**

- **Daily Report**: Select date and view detailed breakdown
- **Monthly Report**: Select month/year for comprehensive analysis
- **Profit Report**: Choose date range to analyze profitability
- **Customer History**: Search and view customer purchase patterns

### **Syncing Data**

- **Automatic**: Set sync interval in Settings
- **Manual**: Click **Sync Now** in sidebar
- **Status**: Check sync indicator in sidebar footer

---

## 🎨 **UI Features**

### **Dark Mode**
- Toggle from sidebar
- Smooth transitions
- Easy on the eyes
- Saved preference

### **Responsive Design**
- Works on desktop, tablet, and mobile
- Sidebar collapses on mobile
- Touch-friendly buttons
- Adaptive layouts

### **Notifications**
- **Green**: Success (sales, saves)
- **Red**: Errors
- **Orange**: Warnings
- **Blue**: Info
- Auto-dismiss after 5 seconds

### **Live Updates**
- Dashboard stats update immediately
- Recent activities feed
- Real-time calculations
- Instant sync feedback

---

## 🔧 **Troubleshooting**

### **Connection Issues**

**Problem:** "Connection Failed" when testing Google Sheets

**Solutions:**
1. Make sure you deployed as "Anyone" can access
2. Open the Web app URL in browser first
3. Click "Allow" when prompted
4. Re-copy the URL and paste in Settings
5. Check if Spreadsheet ID is correct in code.gs

### **Sync Not Working**

**Problem:** Data not syncing to Google Sheets

**Solutions:**
1. Click "Test Connection" in Settings
2. Check your internet connection
3. Verify the Web app URL is correct
4. Make sure auto-sync interval is set
5. Try manual sync with "Sync Now" button

### **Reports Show No Data**

**Problem:** Reports are empty

**Solutions:**
1. Check if you selected the correct date
2. Make sure you've entered some sales
3. Verify data is in localStorage (F12 > Application > Local Storage)
4. Try syncing data again
5. Refresh the page

### **Dark Mode Not Saving**

**Problem:** Theme resets to light mode

**Solutions:**
1. Make sure browser allows localStorage
2. Check if cookies are enabled
3. Try different browser
4. Clear cache and reload

---

## 📊 **Google Sheets Structure**

Your Google Sheet will automatically create these tabs:

1. **Sales**: All sales transactions with timestamps
2. **Cash**: Cash drawer entries by date
3. **Expenses**: All expense records
4. **Services**: List of available services
5. **Sync_Log**: Sync activity tracking (NEW)

---

## 🔐 **Data Privacy**

- All data stored in YOUR Google Sheet
- You own and control all data
- No third-party servers
- Local storage as backup
- Secure Google authentication

---

## 💡 **Tips & Best Practices**

1. **Daily Routine:**
   - Start day: Enter cash in drawer
   - During day: Record sales immediately
   - End day: Review daily report

2. **Weekly Tasks:**
   - Check customer history
   - Review profit reports
   - Export important invoices

3. **Monthly Tasks:**
   - Generate monthly report
   - Analyze trends
   - Plan for next month

4. **Data Management:**
   - Sync regularly
   - Backup Google Sheet monthly
   - Keep customer names consistent

5. **Performance:**
   - Clear old activities periodically
   - Use manual sync for large batches
   - Close unused tabs

---

## 🆘 **Support & Updates**

### **Getting Help:**
- Check this README first
- Review troubleshooting section
- Test connection in Settings
- Check browser console (F12) for errors

### **Feature Requests:**
- Document what you need
- Describe the use case
- Suggest how it should work

---

## 📝 **Version History**

### **v5.0.0** (Current)
- Added dark mode toggle
- Real-time Google Sheets sync
- Sidebar navigation
- Profit report with charts
- Invoice generator
- Customer history tracking
- Enhanced notifications
- Modern UI redesign

### **v4.0.0** (Previous)
- Basic sales tracking
- Cash management
- Expense tracking
- Daily/Monthly reports
- Google Sheets integration

---

## 🚀 **Future Enhancements**

Planned features for future versions:
- [ ] Barcode scanner support
- [ ] SMS/Email invoices
- [ ] Employee management
- [ ] Inventory tracking
- [ ] Tax calculations
- [ ] Multi-currency support
- [ ] Advanced analytics
- [ ] Mobile app version

---

## 📄 **License**

This project is provided as-is for personal and commercial use.
Feel free to modify and customize for your needs.

---

## 🙏 **Credits**

**Developed by:** ShopFlow Team  
**Version:** 5.0.0  
**Last Updated:** February 2026  

**Technologies Used:**
- HTML5, CSS3, JavaScript
- Google Apps Script
- Google Sheets API
- Chart.js
- Font Awesome Icons
- Inter & Poppins Fonts

---

## 📞 **Quick Reference**

### **Keyboard Shortcuts**
- `Esc` - Close modals
- `Enter` - Submit forms (when focused)

### **File Locations**
- **Sales Data:** localStorage → `shopflow_sales`
- **Cash Data:** localStorage → `shopflow_cash_entries`
- **Expense Data:** localStorage → `shopflow_expenses`
- **Settings:** localStorage → `shopflow_settings`

### **Default Settings**
- Theme: Light
- Sync Interval: Manual (0)
- Date Format: YYYY-MM-DD
- Currency: ৳ (Bangladeshi Taka)

---

## ✅ **Checklist**

Before going live, make sure:

- [x] Replaced Spreadsheet ID in code.gs
- [x] Deployed Google Apps Script
- [x] Tested connection in Settings
- [x] Added company logo (mylogo.png)
- [x] Made at least one test sale
- [x] Verified data in Google Sheets
- [x] Tested all reports
- [x] Configured auto-sync
- [x] Tested invoice generation
- [x] Reviewed customer history

---

**🎉 You're all set! Enjoy using ShopFlow Enhanced!**

For questions or issues, refer to the Troubleshooting section above.
