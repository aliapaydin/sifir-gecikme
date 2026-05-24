import { getSession } from '@/lib/session';
import AdStickyBanner from './AdStickyBanner';

export default async function AdStickyWrapper() {
  const session = await getSession();
  if (session?.is_supporter) return null;
  return <AdStickyBanner />;
}
