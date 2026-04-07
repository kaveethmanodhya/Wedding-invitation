import { Playfair_Display, Montserrat, Alex_Brush, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-sinhala',
  display: 'swap',
});

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/** Load config: try MongoDB first, fallback to local file */
async function loadConfig() {
  // 1. Try MongoDB
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
    console.warn('[layout] MongoDB unavailable, falling back to local config:', e.message);
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

export async function generateMetadata() {
  try {
    const config = await loadConfig();
    return {
      title: config.meta?.title || 'Wedding Invitation',
      description: config.meta?.description || 'You are invited!',
      openGraph: {
        title: config.meta?.title,
        description: config.meta?.description,
        images: [config.meta?.ogImage],
      },
    };
  } catch {
    return { title: 'Wedding Invitation' };
  }
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${alexBrush.variable} ${playfair.variable} ${montserrat.variable} ${notoSinhala.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
