import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Terra Fit?",
      answer: "Terra Fit is a premium activewear brand focused on merging high-performance gear with futuristic urban aesthetics (Cyber-Mesh, Neon-Glow)."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the country. International shipping can take 7-14 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn and unwashed items in their original packaging."
    },
    {
      question: "Are the neon elements battery-powered?",
      answer: "Most of our gear uses passive reactive materials that glow under UV light or reflective materials. Some premium items do feature active LED integration with rechargeable batteries."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package."
    }
  ];

  return (
    <div className={styles.faqPage}>
      <div className={styles.meshContainer}>
        <div className={styles.mesh1}></div>
        <div className={styles.mesh2}></div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <Link href="/" className={styles.backLink}>
          ← BACK TO HOME
        </Link>
        
        <h1 className={styles.title}>
          FREQUENTLY ASKED <span className={styles.neonText}>QUESTIONS</span>
        </h1>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.question}>{faq.question}</h3>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.contactPrompt}>
          <p>Still have questions?</p>
          <Link href="/contact" className={styles.contactButton}>
            CONTACT SUPPORT
          </Link>
        </div>
      </div>
    </div>
  );
}
