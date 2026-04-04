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

export default async function WeddingPage({ params }) {
  const { slug } = await params;
  const config = await loadConfig(slug);

  if (!config) {
    // If no config found, return Next.js 404
    notFound();
  }

  return <ClientHome config={config} />;
}
