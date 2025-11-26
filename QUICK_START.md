# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Environment Variables

Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/chaayal-ecommerce
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
ADMIN_PASSWORD=admin123
```

## 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows (if installed as service, it should auto-start)
# Or use MongoDB Compass

# Mac/Linux
mongod
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update MONGODB_URI in .env.local

## 4. Run Development Server
```bash
npm run dev
```

## 5. Access the Application

- **Customer View**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Password: (from ADMIN_PASSWORD in .env.local)

## 6. Add Your First Product

1. Go to `/admin`
2. Login with your admin password
3. Fill in product details:
   - **Image URL**: Use Google Drive direct link
     - Upload image to Google Drive
     - Share → Anyone with link
     - Convert: `https://drive.google.com/uc?export=view&id=FILE_ID`
4. Click "Add Product"

## Google Drive Image URL Format

**Sharing Link:**
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
```

**Direct Image URL (use this):**
```
https://drive.google.com/uc?export=view&id=1ABC123xyz
```

Extract the file ID (between `/d/` and `/view`) and use the format above.

## WhatsApp Number Format

- Include country code
- No spaces or special characters
- Example: `919876543210` (India) or `1234567890` (US)

## That's It!

Your e-commerce store is ready. Customers can browse products and order via WhatsApp!

