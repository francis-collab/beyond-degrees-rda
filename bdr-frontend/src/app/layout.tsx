import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BDR – Beyond Degrees Rwanda',
  description: 'Rwanda’s youth don’t wait for jobs — they create them. Every RWF 10,000 = 1 job.',
  keywords: 'Rwanda, youth, entrepreneurship, crowdfunding, MoMo, jobs',
  icons: { icon: '/logo.svg' },
  openGraph: {
    title: 'BDR – Beyond Degrees Rwanda',
    description: 'Back Rwandan youth startups. Create jobs.',
    url: 'https://bdr.rw',
    siteName: 'BDR',
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Rwandan youth entrepreneur',
      },
    ],
    locale: 'en_RW',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
