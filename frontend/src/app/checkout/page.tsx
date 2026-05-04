"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";
import Link from "next/link";

// 👇 Replace this with your actual Razorpay payment link
const RAZORPAY_PAYMENT_LINK = "https://rzp.io/l/YOUR_RAZORPAY_LINK";


export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      setIsSubmitting(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const shippingDetails = Object.fromEntries(formData.entries());

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          items: cart,
          shippingDetails,
          total: cartTotal
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        // Redirect to Razorpay for payment
        window.location.href = RAZORPAY_PAYMENT_LINK;
      } else {
        setError(data.error || "There was a problem placing your order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Make sure the backend server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`container ${styles.emptyState}`}>
        <h1>YOUR CART IS EMPTY</h1>
        <Link href="/products" className={styles.backButton}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>CHECKOUT</h1>

      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Shipping Details</h2>
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" required />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zip">ZIP Code</label>
                <input type="text" id="zip" name="zip" required />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "PLACE ORDER & PAY"}
            </button>
            <p className={styles.disclaimer}>
              You will be redirected to Razorpay to complete your secure payment.
            </p>
          </form>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            <div className={styles.itemsList}>
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemMeta}>
                      Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
