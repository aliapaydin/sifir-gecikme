'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TutorChat from './TutorChat';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isGame = pathname?.startsWith('/tech-center');
  return (
    <>
      {!isGame && <Navbar />}
      {children}
      {!isGame && <Footer />}
      <TutorChat />
    </>
  );
}
