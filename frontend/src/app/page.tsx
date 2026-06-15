"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { getProducts, Product } from "@/data/products";

// ── Announcement items ───────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  "🚚  Free delivery on orders above ₹999",
  "👔  Shop Men's — New Arrivals Just Dropped",
  "🎉  New season arrivals — Shop Now",
  "↩️  Easy 7-day returns",
  "🔒  100% Secure Payments",
  "⚡  Limited time: Extra 10% off with code TERRAFIT10",
];

// ── Cinematic slideshow — actual product images ──────────────────────────
const CINEMATIC_SLIDES = [
  {
    url: "/images/products/Nike-Air-Force-1-07-Leather-BlackWhite-Panda-Special-Edition.jpg",
    pos: "center 30%",
    tag: "SHOES",
    label: "Panda Edition",
    href: "/products?category=Shoes",
  },
  {
    url: "/images/products/ryan-grice-VKDzcs8kD8E-unsplash.jpg",
    pos: "center 20%",
    tag: "APPAREL",
    label: "Urban Ink Tees",
    href: "/products?category=Apparel",
  },
  {
    url: "/images/products/Off-White-x-Nike-Air-Force-1-Low-Lemonade-DD1876-700-.jpg",
    pos: "center 35%",
    tag: "SHOES",
    label: "Off-White Collab",
    href: "/products?category=Shoes",
  },
  {
    url: "/images/products/kevin-gil-musngi-7JmhXPtW5Co-unsplash.jpg",
    pos: "center 25%",
    tag: "APPAREL",
    label: "Arch Logo Series",
    href: "/products?category=Apparel",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [annIdx, setAnnIdx] = useState(0);
  const [annPrev, setAnnPrev] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  // Helper that tracks prev index for exit animation
  const goAnn = (next: number) => {
    setAnnPrev(annIdx);
    setAnnIdx(next);
    setTimeout(() => setAnnPrev(null), 600);
  };

  // fetch products
  useEffect(() => {
    getProducts().then((p) => setProducts(p.slice(0, 8)));
  }, []);

  // Cycle cinematic slides every 6s
  useEffect(() => {
    const t = setInterval(() => {
      setSlideIdx((i) => (i + 1) % CINEMATIC_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle announcements every 3.5s
  useEffect(() => {
    const t = setInterval(() => {
      setAnnPrev(annIdx);
      setAnnIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
      setTimeout(() => setAnnPrev(null), 600);
    }, 3500);
    return () => clearInterval(t);
  }, [annIdx]);

  return (
    <div className={styles.page}>
      {/* ── Announcement Bar ─────────────────────────────────────────── */}
      <div className={styles.announcementBar}>
        <button
          className={styles.annBtn}
          onClick={() => goAnn((annIdx - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
          aria-label="Previous announcement"
        >‹</button>

        <div className={styles.annSlider}>
          {ANNOUNCEMENTS.map((txt, i) => (
            <span
              key={i}
              className={`${styles.annItem} ${i === annIdx ? styles.annItemActive
                  : i === annPrev ? styles.annItemOut
                    : styles.annItemHidden
                }`}
            >{txt}</span>
          ))}
        </div>

        <div className={styles.annRight}>
          <span className={styles.annCounter}>{annIdx + 1}&nbsp;/&nbsp;{ANNOUNCEMENTS.length}</span>
          <button
            className={styles.annBtn}
            onClick={() => goAnn((annIdx + 1) % ANNOUNCEMENTS.length)}
            aria-label="Next announcement"
          >›</button>
        </div>
        <div className={styles.annProgress} key={annIdx} />
      </div>

      {/* ── Cinematic Video Hero ──────────────────────────────────────── */}
      <section className={styles.hero}>

        {/* ── Cinematic image wallpaper (Ken Burns cross-fade) ── */}
        {CINEMATIC_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`${styles.heroSlide} ${i === slideIdx ? styles.heroSlideActive : ""}`}
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundPosition: slide.pos,
            }}
          />
        ))}

        {/* ── Layers ── */}
        {/* Cinematic color-grade: deep teal shadows + warm highlight */}
        <div className={styles.heroColorGrade} />
        {/* Vignette */}
        <div className={styles.heroVignette} />
        {/* Film grain */}
        <div className={styles.heroGrain} />
        {/* Letterbox bars */}
        <div className={styles.heroLetterboxTop} />
        <div className={styles.heroLetterboxBottom} />

        {/* ── Editorial content ── */}
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>
            {CINEMATIC_SLIDES[slideIdx].tag} &mdash; 2026 COLLECTION
          </span>

          <h1 className={styles.heroHeadline}>
            <span className={styles.heroLine1}>WEAR</span>
            <span className={styles.heroLine2}>YOUR</span>
            <span className={styles.heroLine3}>STORY<span className={styles.heroDot}>.</span></span>
          </h1>

          <p className={styles.heroSub}>
            Premium fashion for those who move with intention.
          </p>

          <div className={styles.heroActions}>
            <Link href={CINEMATIC_SLIDES[slideIdx].href} className={styles.heroCta}>
              Shop {CINEMATIC_SLIDES[slideIdx].label}
            </Link>
            <Link href="/products" className={styles.heroCtaGhost}>
              All Products →
            </Link>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className={styles.heroScroll}>
          <div className={styles.heroScrollLine} />
          <span className={styles.heroScrollLabel}>SCROLL</span>
        </div>

      </section>

      {/* ── Category Grid ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>SHOP BY CATEGORY</h2>
          <div className={styles.catGrid}>
            {[
              {
                label: "Men's",
                href: "/products?category=Men's",
                img: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop",
              },
              {
                label: "Women's",
                href: "/products?category=Women's",
                img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
              },
              {
                label: "Shoes",
                href: "/products?category=Shoes",
                img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
              },
              {
                label: "Apparel",
                href: "/products?category=Apparel",
                img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
              },
              {
                label: "All Gear",
                href: "/products",
                img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
              },
            ].map((cat) => (
              <Link key={cat.label} href={cat.href} className={styles.catCard}>
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className={styles.catImg}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className={styles.catOverlay} />
                <span className={styles.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────────────── */}
      <section className={styles.promoBanner}>
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961a28c?q=80&w=1800&auto=format&fit=crop"
          alt="New Season Drop"
          fill
          className={styles.promoImg}
          sizes="100vw"
        />
        <div className={styles.promoOverlay} />
        <div className={styles.promoContent}>
          <span className={styles.promoTag}>LIMITED EDITION</span>
          <h2 className={styles.promoHeadline}>New Season Drop</h2>
          <p className={styles.promoSub}>
            Fresh silhouettes. Bold palettes. Zero compromises.
          </p>
          <Link href="/products" className={styles.promoCta}>
            Explore Collection
          </Link>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionHeading}>LATEST DROPS</h2>
            <Link href="/products" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={styles.productCard}
              >
                <div className={styles.productImgWrap}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.productImg}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className={styles.productBadge}>{product.category}</div>
                  <div className={styles.productQuickAdd}>Quick Add</div>
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productPrice}>₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP Strip ─────────────────────────────────────────────────── */}
      <div className={styles.uspStrip}>
        <div className={styles.container}>
          <div className={styles.uspGrid}>
            {[
              { icon: "🚚", title: "Free Delivery", sub: "On orders above ₹999" },
              { icon: "↩️", title: "Easy Returns", sub: "7-day hassle-free returns" },
              { icon: "🔒", title: "Secure Payment", sub: "100% safe & encrypted" },
              { icon: "🏆", title: "Premium Quality", sub: "Crafted for performance" },
            ].map((u) => (
              <div key={u.title} className={styles.uspItem}>
                <span className={styles.uspIcon}>{u.icon}</span>
                <div>
                  <p className={styles.uspTitle}>{u.title}</p>
                  <p className={styles.uspSub}>{u.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
