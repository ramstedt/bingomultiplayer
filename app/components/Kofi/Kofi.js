import Image from 'next/image';
import Link from 'next/link';
import styles from './Kofi.module.css';

const Kofi = () => {
  return (
    <Link
      href='https://ko-fi.com/catstasis'
      target='_blank'
      className={styles.kofi}
    >
      <Image
        src='/kofi.webp'
        alt='Support me on Ko-fi'
        width={200}
        height={50}
      />
    </Link>
  );
};

export default Kofi;
