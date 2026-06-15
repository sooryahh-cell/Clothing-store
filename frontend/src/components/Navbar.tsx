"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  useEffect(() => {
    // Check localStorage for logged-in user on mount
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }

    // Listen for storage changes (e.g. login from another tab)
    const handleStorage = () => {
      const s = localStorage.getItem("user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          TERRA FIT
        </Link>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Search drops..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <div className={styles.searchBorder}></div>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/products?category=Shoes" className={styles.link}>SHOES</Link>
          <Link href="/products?category=Apparel" className={styles.link}>APPAREL</Link>
          <Link href="/products" className={styles.link}>ALL GEAR</Link>
        </nav>
        <div className={styles.cartContainer}>
          {user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.userName}>👤 {user.name.split(" ")[0]}</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
          )}
          <Link href="/cart" className={styles.cartButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
