# Cloudinary Setup Guide

## Required Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## How to Get These Values

### 1. Cloudinary Cloud Name
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Your **Cloud Name** is displayed at the top of the dashboard
3. Copy it to `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### 2. Upload Preset
1. In your Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: Choose a name (e.g., `mr-tecy-uploads`)
   - **Signing mode**: Select **Unsigned** (for client-side uploads)
   - **Folder**: Optionally specify a base folder
   - **Upload control**: Configure file size limits, formats, etc.
5. Click **Save**
6. Copy the preset name to `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## Example `.env.local`

```env
# Firebase Configuration (existing)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_SERVICE_ACCOUNT_KEY=...

# Cloudinary Configuration (new)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## Testing the Upload

After setting up the environment variables:

1. Restart your development server
2. Go to the Admin Services page
3. Try creating a new service with an image
4. The image should upload to Cloudinary instead of Firebase Storage

## Troubleshooting

If uploads fail, check:
- ✅ Environment variables are set correctly
- ✅ Development server was restarted after adding env vars
- ✅ Upload preset is configured as **Unsigned**
- ✅ File size limits in Cloudinary match your validation (5MB)
- ✅ Browser console for detailed error messages
