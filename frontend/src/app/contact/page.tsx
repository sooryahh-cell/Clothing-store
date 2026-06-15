import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <div className={styles.meshContainer}>
        <div className={styles.mesh1}></div>
        <div className={styles.mesh2}></div>
      </div>
      
      <div className={`container ${styles.content}`}>
        <Link href="/" className={styles.backLink}>
          ← BACK TO HOME
        </Link>
        
        <h1 className={styles.title}>
          GET IN <span className={styles.neonText}>TOUCH.</span>
        </h1>
        
        <div className={styles.grid}>
          <div className={styles.contactInfo}>
            <p className={styles.lead}>
              Have a question about an order or just want to say hello? Our team is here to help.
            </p>
            
            <div className={styles.methods}>
              <div className={styles.method}>
                <h3>EMAIL</h3>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=terrafit7.business@gmail.com" target="_blank" rel="noopener noreferrer">
                  terrafit7.business@gmail.com
                </a>
              </div>
              
              <div className={styles.method}>
                <h3>WHATSAPP</h3>
                <a href="https://wa.me/919567232977" target="_blank" rel="noopener noreferrer">
                  +91 95672 32977
                </a>
              </div>
              
              <div className={styles.method}>
                <h3>INSTAGRAM</h3>
                <a href="https://www.instagram.com/sooryah__h/?__pwa=1#" target="_blank" rel="noopener noreferrer">
                  @sooryah__h
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.formContainer}>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>NAME</label>
                <input type="text" placeholder="Your name" />
              </div>
              <div className={styles.formGroup}>
                <label>EMAIL</label>
                <input type="email" placeholder="Your email" />
              </div>
              <div className={styles.formGroup}>
                <label>MESSAGE</label>
                <textarea rows={5} placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className={styles.submitButton}>
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
