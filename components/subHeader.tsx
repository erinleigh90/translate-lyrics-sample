import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function SubHeader() {
  return (
    <div className={styles.subHeader}>
      <Link href="/addSong">
        <div className={styles.subHeaderButton}>
          <svg viewBox="0 0 100 100" aria-hidden="true" role="presentation" focusable="false">
            <path d="M50 0 L50 100 M0 50 L100 50" strokeLinecap="round"></path>
          </svg>
          Add Song
        </div>
      </Link>
    </div>
  );
}