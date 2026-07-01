import './globals.css';
import { Rethink_Sans } from 'next/font/google';
import Footer from './components/Footer/Footer';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Chat Bingo',
  description:
    'Live bingo for Twitch streamers and their chat. Create a card, share the code, and play together in real time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={rethinkSans.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
