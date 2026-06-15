import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/data/products";
import styles from "./page.module.css";

export default async function ProductsPage(
  props: { searchParams: Promise<{ category?: string; search?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentCategory = searchParams.category || "All";
  const searchQuery = searchParams.search?.toLowerCase() || "";

  const allProducts = await getProducts();
  
  let filteredProducts = allProducts;

  // Filter by category - only if not searching
  if (currentCategory !== "All" && !searchQuery) {
    filteredProducts = filteredProducts.filter((p) => p.category === currentCategory);
  }

  // Filter by search query
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.description.toLowerCase().includes(searchQuery)
    );
  }


  const categories = ["All", "Men's", "Women's", "Shoes", "Apparel"];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{currentCategory === "All" ? "All Gear" : currentCategory}</h1>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterList}>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/products" : `/products?category=${cat}`}
              className={`${styles.filterButton} ${currentCategory === cat ? styles.active : ""}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No drops found for &quot;{searchParams.search || currentCategory}&quot;.</p>
          <Link href="/products" className={styles.clearSearch}>Clear all filters</Link>
        </div>
      )}
    </div>
  );
}
