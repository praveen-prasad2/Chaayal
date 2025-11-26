# Google Drive Image Setup Guide

## Why Images Might Not Be Visible

If images are not showing up, it's usually due to one of these reasons:

1. **Image is not set to public sharing**
2. **Wrong URL format** (using sharing link instead of direct image URL)
3. **CORS restrictions** (though we handle this automatically)

## Step-by-Step Setup

### 1. Upload Image to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Upload your product image
3. Right-click on the image file
4. Select **"Share"** or click the share icon

### 2. Set Sharing Permissions

1. In the sharing dialog, click **"Change to anyone with the link"**
2. Make sure the permission is set to **"Viewer"** (not Editor)
3. Click **"Done"**

### 3. Get the Direct Image URL

**Option A: Using Sharing Link (Recommended)**

1. Copy the sharing link (it looks like):
   ```
   https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
   ```

2. The app will automatically convert it to a direct image URL, OR you can manually convert it:
   - Extract the file ID (the part between `/d/` and `/view`)
   - Format: `https://drive.google.com/uc?export=view&id=FILE_ID`
   - Example: `https://drive.google.com/uc?export=view&id=1ABC123xyz`

**Option B: Direct Image URL Format**

Use this format directly:
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

### 4. Add to Admin Panel

1. Go to `/admin`
2. In the "Product Images" field, paste the URL
3. The app will automatically convert sharing links to direct image URLs

## Troubleshooting

### Image Still Not Showing?

1. **Check Sharing Settings:**
   - Make sure the image is set to "Anyone with the link can view"
   - Not just "Shared with specific people"

2. **Verify URL Format:**
   - Should be: `https://drive.google.com/uc?export=view&id=FILE_ID`
   - NOT: `https://drive.google.com/file/d/FILE_ID/view`

3. **Test the URL:**
   - Copy the URL and paste it directly in a new browser tab
   - If it shows the image, the URL is correct
   - If you see a Google Drive page, the sharing settings are wrong

4. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check the Console tab for any CORS or loading errors
   - Check the Network tab to see if the image request is failing

### Common Error Messages

- **"Image failed to load"**: Check sharing permissions
- **CORS error**: Image needs to be publicly accessible
- **404 error**: File ID is incorrect or file was deleted

## Best Practices

1. **Use Direct Image URLs** in the admin panel for better reliability
2. **Test images** before adding them to products
3. **Keep images organized** in a Google Drive folder
4. **Use consistent naming** for easier management

## Alternative: Using Google Drive Direct Links

If the standard method doesn't work, you can also use:

```
https://lh3.googleusercontent.com/d/FILE_ID
```

This is Google's thumbnail service and sometimes works better for public images.

## Need Help?

If images still don't load:
1. Check the browser console for specific error messages
2. Verify the image URL format
3. Ensure the image is publicly accessible
4. Try a different image to rule out file-specific issues

