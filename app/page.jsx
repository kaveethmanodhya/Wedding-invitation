import ClientHome from './ClientHome';

/** Load config: try MongoDB first, fallback to local file */
async function loadConfig() {
  // 1. Try MongoDB Atlas
  try {
    if (process.env.MONGODB_URI) {
      const getMongoClientPromise = (await import('@/lib/mongodb')).default;
      const client = await getMongoClientPromise();
      const db = client.db('wedding_app');
      const doc = await db.collection('settings').findOne({ _id: 'global_config' });
      if (doc) {
        const { _id, ...config } = doc;
        return config;
      }
    }
  } catch (e) {
    console.warn('[page] MongoDB unavailable, falling back to local config:', e.message);
  }

  // 2. Fallback to local file
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const raw = readFileSync(join(process.cwd(), 'data', 'config.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function Home() {
  const config = await loadConfig();
  return <ClientHome config={config} />;
}
