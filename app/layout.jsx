import { Playfair_Display, Montserrat, Alex_Brush } from 'next/font/google';
import './globals.css';

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
  let themeStyles = '';
  try {
    const config = await loadConfig();
    const theme = config.theme || {};
    
    themeStyles = `
      :root {
        --colorPrimary: ${theme.colorPrimary || '#C9956A'};
        --colorSecondary: ${theme.colorSecondary || '#E8D5B7'};
        --colorTextLight: ${theme.colorTextLight || '#FAF7F2'};
        --colorTextDark: ${theme.colorTextDark || '#2C2018'};
        --colorBg: ${theme.colorBg || '#FBF8F4'};
        --colorSurface: ${theme.colorSurface || '#FFFFFF'};
        --heroOverlayStart: ${theme.heroOverlayStart || 'rgba(18, 12, 6, 0.55)'};
        --heroOverlayEnd: ${theme.heroOverlayEnd || 'rgba(18, 12, 6, 0.25)'};
      }
    `;
  } catch (e) {
    console.error('Failed to load theme config:', e);
  }

  return (
    <html lang="en" className={`${alexBrush.variable} ${playfair.variable} ${montserrat.variable}`}>
      <head>
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
      </head>
      <body className="font-sans antialiased overflow-x-hidden bg-[var(--colorBg)] text-[var(--colorTextDark)]">
        {children}
      </body>
    </html>
  );
}
