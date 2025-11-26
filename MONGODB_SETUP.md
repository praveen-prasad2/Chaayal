# MongoDB Connection Setup Guide

## Common Authentication Error Fix

If you're seeing "bad auth: authentication failed" error, it's usually because:

### 1. Special Characters in Password Need URL Encoding

If your MongoDB password contains special characters, they must be URL-encoded in the connection string:

| Character | URL Encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| ` ` (space) | `%20` |

### Example

**Original Password:** `Praveen@14`

**Connection String:**
```
mongodb+srv://praveenprasad:Praveen%4014@workspace.cvfalzl.mongodb.net/chaayal-ecommerce?appName=Workspace
```

Notice: `@` is replaced with `%40`

### 2. Verify Your MongoDB Atlas Credentials

1. Go to MongoDB Atlas Dashboard
2. Click on "Database Access" in the left sidebar
3. Verify your username and password
4. Make sure the user has "Read and write to any database" permissions

### 3. Check Your Connection String Format

**Correct Format:**
```
mongodb+srv://USERNAME:ENCODED_PASSWORD@cluster.mongodb.net/DATABASE_NAME?appName=APP_NAME
```

**Your .env.local should have:**
```env
MONGODB_URI=mongodb+srv://praveenprasad:Praveen%4014@workspace.cvfalzl.mongodb.net/chaayal-ecommerce?appName=Workspace
```

### 4. Network Access

Make sure your IP address is whitelisted in MongoDB Atlas:
1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. For development, you can use "Allow Access from Anywhere" (0.0.0.0/0) - **Note: Only for development, not production!**

### Quick Fix for Your Current Setup

Update your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://praveenprasad:Praveen%4014@workspace.cvfalzl.mongodb.net/chaayal-ecommerce?appName=Workspace
NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
ADMIN_PASSWORD=your_admin_password
```

**Important:** Replace `@` with `%40` in the password part of the connection string.

### Testing the Connection

After updating `.env.local`, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

You should see "✅ MongoDB connected successfully" in the terminal if the connection is successful.

