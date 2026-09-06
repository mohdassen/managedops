import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'ManagedOps Control Center', description: 'Managed Services Readiness Intelligence' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
