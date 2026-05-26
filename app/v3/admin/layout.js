import { redirect } from 'next/navigation';
import { getSession } from '@/lib/v3/auth';

export const metadata = { title: 'Admin Panel' };

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) redirect('/v3/giris');
  if (session.role !== 'admin') redirect('/v3');

  return children;
}
