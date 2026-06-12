import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';
import JSZip from 'jszip';

export async function GET(request, { params }) {
  try {
    // Next.js 15+ dynamic route params are resolved asynchronously
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required.' }, { status: 400 });
    }

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    // Find specific invitation by its slug
    const query = (slug === 'global_config') ? { _id: 'global_config' } : { slug };
    const config = await db.collection('settings').findOne(query);

    if (!config) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    // List to hold { url, name }
    const mediaList = [];
    const addMedia = (url, name) => {
      if (url && typeof url === 'string' && url.startsWith('http')) {
        mediaList.push({ url, name });
      }
    };

    // Extract media mappings based on common config schema
    addMedia(config.heroImage, 'hero-image');
    addMedia(config.heroVideo, 'hero-video');
    addMedia(config.audioUrl, 'background-music');
    addMedia(config.envelope?.bgImage, 'envelope-bg');
    addMedia(config.envelope?.outerBgImage, 'envelope-outer-bg');
    addMedia(config.envelope?.sealImage, 'envelope-seal');
    addMedia(config.envelopeVideo, 'envelope-video');
    addMedia(config.coverImage, 'cover-image');
    addMedia(config.revealCoverImage, 'reveal-cover-image');
    addMedia(config.coupleImages?.groom, 'groom-image');
    addMedia(config.coupleImages?.bride, 'bride-image');
    addMedia(config.coupleRevealRoseGif, 'couple-reveal-rose');
    addMedia(config.sharePreviewImageUrl, 'share-preview-image');

    // loop through sectionBackgrounds
    if (config.sectionBackgrounds) {
      for (const [sec, url] of Object.entries(config.sectionBackgrounds)) {
        addMedia(url, `section-bg-${sec}`);
      }
    }

    // loop through events
    if (config.events) {
      for (const [evtName, evt] of Object.entries(config.events)) {
        addMedia(evt.image, `event-${evtName}-image`);
      }
    }

    // loop through extraEvents
    if (Array.isArray(config.extraEvents)) {
      config.extraEvents.forEach((evt, i) => {
        addMedia(evt.image, `extra-event-${i + 1}`);
      });
    }

    // loop through gallery
    if (Array.isArray(config.gallery)) {
      config.gallery.forEach((g, i) => {
        addMedia(g.src, `gallery-image-${i + 1}`);
      });
    }

    const zip = new JSZip();

    // Iterate over the filtered media list, fetching each asset
    for (const media of mediaList) {
      try {
        const res = await fetch(media.url);
        if (!res.ok) {
          console.error(`[export-media] Failed to fetch ${media.url}: ${res.statusText}`);
          continue; // Skip failed requests
        }
        
        const buffer = await res.arrayBuffer();
        
        // Extract file extension
        let ext = '.jpg';
        // Match standard file extensions from URL
        const match = media.url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
        if (match) {
          ext = `.${match[1]}`;
        } else {
          // Fallback to checking Content-Type header
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('png')) ext = '.png';
          else if (ct.includes('jpeg') || ct.includes('jpg')) ext = '.jpg';
          else if (ct.includes('mp4')) ext = '.mp4';
          else if (ct.includes('mpeg')) ext = '.mp3';
          else if (ct.includes('webm')) ext = '.webm';
          else if (ct.includes('gif')) ext = '.gif';
          else if (ct.includes('webp')) ext = '.webp';
        }

        zip.file(`${media.name}${ext}`, buffer);
      } catch (err) {
        console.error(`[export-media] Error fetching/adding ${media.name} to zip:`, err);
        // Continue loop even if one image fails
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slug}-media-backup.zip"`,
      }
    });

  } catch (error) {
    console.error('[api/export-media] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
