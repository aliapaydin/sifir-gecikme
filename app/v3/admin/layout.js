import { redirect } from 'next/navigation';
import { getSession } from '@/lib/v3/auth';

export const metadata = { title: 'Admin Panel' };

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) redirect('/giris');
  if (session.role !== 'admin') redirect('/');

  return children;
}
