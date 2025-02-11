import React from 'react';
import styles from './Header.css';

export default function Header() {
  return (
    <header>
      <div className={styles.topBar}>
        <div className={styles.topBarText}>
          <span className={styles.designText}>Website was design by FPT.</span>
          <span className={styles.knowMoreText}>Here's how you know</span>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/86adf66ec120e73362d1251fb3b954dbf999f6a874581170b553c39358def670?placeholderIfAbsent=true&apiKey=4b2823083f6443d6bf7b2e849ae2d3e3" 
            alt=""
            className={styles.infoIcon}
          />
        </div>
      </div>
    </header>
  );
}