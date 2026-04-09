# Walkthrough - Dynamic OG Image Configuration

I have successfully implemented the dynamic Open Graph (OG) image configuration feature, giving you full control over how your wedding invitations look when shared on platforms like WhatsApp, Facebook, and X (Twitter).

## Changes Made

### 1. Configuration Schema Updated
- **File**: `models/Config.js`
- **Action**: Safely appended `sharePreviewImageUrl` to the root of the invitation configuration schema. This ensures every new invitation has this field available by default.

### 2. Admin Interface Enhanced
- **File**: `app/admin/page.jsx`
- **Action**: Added a new **"SHARE PREVIEW IMAGE (OG Image)"** block in the **Wedding** tab. 
- **Features**:
  - **Dynamic Input**: Paste a direct image URL.
  - **Cloudinary Integration**: Upload a file directly from your computer.
  - **Live Preview**: Instantly see a thumbnail of the image you've selected.
  - **Consistency**: The UI matches the existing "Hero Background Video" block for a seamless editing experience.

### 3. Public Invitation Metadata
- **File**: `app/[slug]/page.jsx`
- **Action**: Implemented a dynamic `generateMetadata` function that fetches the specific invitation's configuration and injects the following tags into the `<head>`:
  - `og:image` and `twitter:image` using your uploaded URL.
  - Recommended dimensions (1200x630) for perfect social media scaling.
  - Dynamic `title` and `description` based on the invitation's SEO settings.

## Verification Results

### Visual Confirmation (Admin Panel)
The screenshot below confirms the new field is correctly integrated into the Admin dashboard:
![Admin OG Image Configuration](file:///Users/kaveethmanodhya/.gemini/antigravity/brain/7bb7524b-ccc5-4823-82d0-c7a2fb73926d/admin_og_image_saved_1775726958135.png)

### Logic Validation
- **Persistence**: Verified that saving the config correctly stores the `sharePreviewImageUrl` without overwriting other data.
- **Metadata**: Confirmed that the live invitation page correctly identifies the custom preview image for SEO tags.

## Recovery Reminder
I have updated your local `chat_history/` archive with these new implementation details and screenshots, ensuring you can reference or recover this work in future sessions.
