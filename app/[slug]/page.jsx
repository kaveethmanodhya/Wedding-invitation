export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import ClientHome from '../ClientHome';

/** Load config for a specific slug from MongoDB */
async function loadConfig(slug) {
  try {
    const getMongoClientPromise = (await import('@/lib/mongodb')).default;
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    
    // Support both the new 'slug' field and the legacy 'global_config' for now
    const query = (slug === 'global' || slug === 'wedding') 
      ? { $or: [{ slug }, { _id: 'global_config' }] } 
      : { slug };
      
    const doc = await db.collection('settings').findOne(query);
    if (doc) {
      const { _id, ...config } = doc;
      return config;
    }
  } catch (e) {
    console.error(`[page/${slug}] Failed to load config:`, e.message);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = await loadConfig(slug);
  if (!config) return { title: 'Wedding Invitation' };

  const previewImage = config.sharePreviewImageUrl || config.meta?.ogImage || config.heroImage || '';

  return {
    title: config.meta?.title || config.couple?.displayNames || 'Wedding Invitation',
    description: config.meta?.description || 'You are invited to our wedding!',
    openGraph: {
      title: config.meta?.title || config.couple?.displayNames || 'Wedding Invitation',
      description: config.meta?.description || 'You are invited to our wedding!',
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `${config.couple?.displayNames || 'Wedding'} Invitation`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.meta?.title || config.couple?.displayNames || 'Wedding Invitation',
      description: config.meta?.description || 'You are invited to our wedding!',
      images: [previewImage],
    },
  };
}

export default async function WeddingPage({ params }) {
  const { slug } = await params;
  const config = await loadConfig(slug);

  if (!config) {
    // If no config found, return Next.js 404
    notFound();
  }

  // Inactive invitation — show a placeholder instead of the real content
  if (config.isActive === false) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1a0a0a] text-center px-6">
        <div className="mb-6 opacity-20">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9956A" strokeWidth="1.5">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#C9956A] mb-3 leading-snug">
          Sample Not Available
        </h1>
        <p className="text-sm text-white/50 max-w-xs leading-relaxed">
          This invitation is not currently live. Please contact{' '}
          <span className="text-[#C9956A] font-semibold">Kodex Admin</span> for more information.
        </p>
      </div>
    );
  }

  return <ClientHome config={config} />;
}
