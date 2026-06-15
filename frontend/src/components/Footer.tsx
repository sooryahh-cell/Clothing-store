import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>TERRA FIT</h2>
          <p className={styles.tagline}>Premium activewear for the modern athlete.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h3>Shop</h3>
            <Link href="/products?category=Shoes">Shoes</Link>
            <Link href="/products?category=Apparel">Apparel</Link>
            <Link href="/products">All Gear</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3>Support</h3>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3>Contact</h3>
            <Link href="/contact" className={styles.contactLink}>Email</Link>
            <a href="https://wa.me/919567232977" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>WhatsApp</a>
            <a href="https://www.instagram.com/sooryah__h/?__pwa=1#" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>Instagram</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Terra Fit. All rights reserved.</p>
      </div>
    </footer>
  );
}
