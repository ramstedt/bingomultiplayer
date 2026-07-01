import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.supportRow}>
        <span className={styles.supportLabel}>Support Chat Bingo</span>
        <Link href='https://ko-fi.com/catastasia' target='_blank' className={styles.kofi}>
          <Image src='/kofi.webp' alt='Support me on Ko-fi' width={160} height={40} />
        </Link>
      </div>
      <div className={styles.divider} />
      <p className={styles.credit}>
        Made by{' '}
        <Link href='https://ko-fi.com/catastasia' target='_blank'>
          Catastasia
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
