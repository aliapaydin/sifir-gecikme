import { getSession } from '@/lib/session';
import AdBanner from './AdBanner';

// Server Component — destekçilere reklam göstermez
export default async function AdWrapper({ slot, format, fullWidth }) {
  const session = await getSession();
  if (session?.is_supporter) return null;
  return <AdBanner slot={slot} format={format} fullWidth={fullWidth} />;
}
