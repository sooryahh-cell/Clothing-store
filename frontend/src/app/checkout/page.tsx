"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Extend window object to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(form);
    const shippingDetails = Object.fromEntries(formData.entries());

    // 1. Load Razorpay Script
    const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!resScript) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsSubmitting(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const finalTotal = Number(cartTotal);
    console.log(`Final Total being sent: ${finalTotal}`);

    try {
      // 2. Create Order on Backend
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          items: cart,
          shippingDetails,
          total: finalTotal
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 3. Initialize Razorpay Payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Terra Fit",
        description: "Purchase from Terra Fit store",
        image: "/logo.png",
        order_id: data.order_id,
        callback_url: `${apiUrl}/api/orders/callback`,
        redirect: true,
        prefill: {
          name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
          email: shippingDetails.email,
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Make sure the backend server is running.");
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
              {isSubmitting ? "PROCESSING..." : `PAY ₹${cartTotal.toFixed(2)} WITH RAZORPAY`}
            </button>
            <p className={styles.disclaimer}>
              Secure payment powered by Razorpay.
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

