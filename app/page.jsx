import { readFileSync } from 'fs';
import { join } from 'path';
import ClientHome from './ClientHome';

function getConfig() {
  const filePath = join(process.cwd(), 'data', 'config.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export default function Home() {
  const config = getConfig();

  return <ClientHome config={config} />;
}
