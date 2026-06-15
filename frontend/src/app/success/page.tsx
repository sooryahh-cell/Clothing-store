"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "./page.module.css";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart on successful payment landing
    clearCart();
  }, [clearCart]);

  return (
    <div className={`container ${styles.successPage}`}>
      <div className={styles.successCard}>
        <div className={styles.iconWrapper}>
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#C9FF3B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className={styles.title}>PAYMENT SUCCESSFUL!</h1>
        <p className={styles.subtitle}>Your gear is on the way. Check your email for order details.</p>
        <Link href="/products" className={styles.homeButton}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
