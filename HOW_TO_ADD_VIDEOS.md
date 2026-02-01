# How to Add Videos to the Library

## Quick Guide

### Step 1: Access Admin Panel
1. Navigate to `/admin/login`
2. Enter your admin password (set in `.env` as `ADMIN_SECRET_KEY`)
3. Click "Login"

### Step 2: Add a Video
1. In the Admin Dashboard, go to **"Video Vault"** tab
2. Click **"Add Video"** button
3. Fill in the form:
   - **Title**: Name of the video (e.g., "ECG Interpretation")
   - **YouTube/Vimeo URL**: Full URL to the video
     - YouTube: `https://www.youtube.com/watch?v=VIDEO_ID`
     - Vimeo: `https://vimeo.com/VIDEO_ID`
   - **Category**: Select from dropdown (Cardiology, Neurology, etc.)
   - **High-Yield**: Check if this is high-yield content
4. Click **"Add Video"**

### Step 3: View in Library
1. Navigate to **"Library"** in the main sidebar
2. Your video will appear automatically
3. Click on the video card to watch it in Focus Mode

## Supported Video Platforms

### YouTube
- **Supported URLs:**
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`

### Vimeo
- **Supported URLs:**
  - `https://vimeo.com/VIDEO_ID`
  - `https://vimeo.com/channels/CHANNEL/VIDEO_ID`

## Automatic Features

When you add a video, the system automatically:
- ✅ Extracts video ID from URL
- ✅ Generates thumbnail (YouTube/Vimeo)
- ✅ Creates embed URL for playback
- ✅ Shows in library with proper formatting
- ✅ Enables full-screen playback in Focus Mode

## Thumbnails

Thumbnails are automatically generated:
- **YouTube**: Uses `maxresdefault.jpg` (highest quality)
- **Vimeo**: Uses Vumbnail service
- **Fallback**: Shows gradient placeholder if thumbnail fails

## Tips

1. **Use Full URLs**: Always paste the complete URL from your browser
2. **High-Yield Tag**: Mark important videos for easy filtering
3. **Categories**: Use consistent categories for better organization
4. **Refresh**: Click the "Refresh" button in Library to see new videos immediately

## Troubleshooting

### Video Not Showing
- Check that the URL is valid
- Verify the video exists on YouTube/Vimeo
- Click "Refresh" button in Library
- Check browser console for errors

### Thumbnail Not Loading
- Thumbnails may take a few seconds to load
- Some videos may not have thumbnails available
- The system will show a placeholder if thumbnail fails

### Video Won't Play
- Ensure the video is publicly accessible
- Check if the video allows embedding
- Try opening the URL directly in a new tab

## Future Enhancements

Planned features:
- Video duration extraction
- Progress tracking per video
- Playlist support
- Custom thumbnails upload
- Video notes and bookmarks
