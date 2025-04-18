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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://52.192.165.145:8081/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.text();
      alert("Response: " + data);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
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
