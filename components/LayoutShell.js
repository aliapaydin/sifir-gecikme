'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TutorChat from './TutorChat';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isGame = pathname?.startsWith('/tech-center');
  const isV3   = pathname?.startsWith('/v3') || pathname === '/';
  const showShell = !isGame && !isV3;
  return (
    <>
      {showShell && <Navbar />}
      {children}
      {showShell && <Footer />}
      {showShell && <TutorChat />}
    </>
  );
}
