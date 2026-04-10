# Implementation Plan - Dynamic OG Image Configuration

This plan outlines the steps to allow admins to upload and configure a custom share preview image (Open Graph image) for each invitation.

## User Review Required

> [!IMPORTANT]
> - **Metadata Prioritization**: Adding `generateMetadata` to `app/[slug]/page.jsx` will override the global metadata in `app/layout.jsx` for specific invitations. I will ensure that existing metadata (title/description) from the invitation's config is also used if available to maintain SEO consistency.
> - **Field Placement**: The user requested adding `sharePreviewImageUrl` to the schema. I will place it at the root of the configuration object for direct access.

## Proposed Changes

### [Component] Configuration Schema

#### [MODIFY] [Config.js](file:///Users/kaveethmanodhya/Desktop/Uni_Docs/Online%20Wedding%20Invite/nextjs-wedding/models/Config.js)
- Add `sharePreviewImageUrl: ''` to the root of the object returned by `getDefaultConfig`.

### [Component] Admin Interface

#### [MODIFY] [page.jsx](file:///Users/kaveethmanodhya/Desktop/Uni_Docs/Online%20Wedding%20Invite/nextjs-wedding/app/admin/page.jsx)
- In the "Wedding" tab (`activeTab === 'wedding'`), append a new `FieldGroup` for "SHARE PREVIEW IMAGE (OG Image)".
- Implement it using the `ImageField` component, wired to the `sharePreviewImageUrl` path.
- This will automatically support Cloudinary uploads and URL inputs as requested.

### [Component] Public Invitation Page

#### [MODIFY] [page.jsx](file:///Users/kaveethmanodhya/Desktop/Uni_Docs/Online%20Wedding%20Invite/nextjs-wedding/app/%5Bslug%5D/page.jsx)
- Implement `export async function generateMetadata({ params })`.
- Fetch the invitation config using `loadConfig(slug)`.
- Extract the `sharePreviewImageUrl` and set it as the `og:image` and `twitter:image`.
- Ensure fallback logic to use a default image or the existing `meta.ogImage` if the new field is empty.
- Set recommended OG dimensions (1200x630).

## Open Questions

- Should I also include dynamic **Title** and **Description** in the `generateMetadata` function for `[slug]/page.jsx` to ensure they match the invitation's specific `meta` settings, or keep them as per the layout's global defaults? (Recommended: use the invitation-specific settings if they exist).

## Verification Plan

### Automated Tests
- I'll use the browser subagent to:
  1. Login to Admin.
  2. Navigate to an invitation's "Wedding" tab.
  3. Upload a test image for the Share Preview.
  4. Save the config.
  5. Visit the live invitation page.
  6. Inspect the `<head>` for correct `og:image` and `twitter:image` tags.

### Manual Verification
- Share the link on a platform (like a metadata checker tool) to see if the preview image updates.
