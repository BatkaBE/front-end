"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (form) => {
    try {
      const res = await fetch("https://13.113.28.205/email/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Origin": "https://main.d18u6ezpsflfs9.amplifyapp.com"
        },
        body: JSON.stringify(form),
        mode: 'cors',
        credentials: 'same-origin'
      });
  
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span>Mail Service</span>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/file-manager">File Manager</Link>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <h1>Send an Email</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            To:
            <input
              type="email"
              name="to"
              value={form.to}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              name="body"
              rows={6}
              value={form.body}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Send Email</button>
        </form>
      </main>


    </div>
  );
}
