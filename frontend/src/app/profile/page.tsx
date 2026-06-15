"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
  razorpayOrderId: string;
}

interface UserData {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async (token: string) => {
    setLoading(true);
    setError("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${apiUrl}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      // Parse items if they come as a string from MySQL JSON column
      const parsed = data.map((order: any) => ({
        ...order,
        items:
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items,
        shippingDetails:
          typeof order.shippingDetails === "string"
            ? JSON.parse(order.shippingDetails)
            : order.shippingDetails,
      }));
      setOrders(parsed);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push("/login");
      return;
    }

    fetchOrders(token);
  }, [router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return styles.statusPaid;
      case "pending":
        return styles.statusPending;
      case "failed":
        return styles.statusFailed;
      default:
        return styles.statusPending;
    }
  };

  if (!user) return null;

  return (
    <div className={`container ${styles.page}`}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user.name}</h1>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      {/* Orders Section */}
      <div className={styles.sectionTitle}>
        <span>Order History</span>
        {orders.length > 0 && (
          <span className={styles.orderCount}>{orders.length}</span>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading your orders...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) fetchOrders(token);
            }}
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptyMessage}>
            You haven&apos;t placed any orders. Explore our collection and grab
            something you love.
          </p>
          <Link href="/products" className={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderId}>
                    #{order.razorpayOrderId || `TF-${order.id}`}
                  </span>
                  <span className={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className={styles.orderRight}>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <span className={styles.orderTotal}>
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className={styles.orderItems}>
                {Array.isArray(order.items) &&
                  order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${idx}`}
                      className={styles.orderItem}
                    >
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemMeta}>
                          Qty: {item.quantity}
                          {item.size ? ` · Size: ${item.size}` : ""}
                        </span>
                      </div>
                      <span className={styles.itemPrice}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
