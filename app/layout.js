import './globals.css';
import { Rethink_Sans } from 'next/font/google';

const rethinkSans = Rethink_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Multiplayer Bingo by Catface',
  description:
    'Create your own bingo card and share it with your friends. Real time updates!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={rethinkSans.className}>{children}</body>
    </html>
  );
}
