"use client"; // Ensure this is at the top for client-side code

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch email history
  useEffect(() => {
    fetch("https://3.112.227.170/email/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("History Fetch Error:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://3.112.227.170/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://main.d18u6ezpsflfs9.amplifyapp.com",
        },
        body: JSON.stringify(form),
        mode: "cors",
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const contentType = res.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
        alert(result.message || "Email sent successfully!");
      } else {
        result = await res.text();
        alert(result || "Email sent successfully!");
      }

      setForm({ to: "", subject: "", body: "" });

      // Refresh email history
      const updatedHistory = await fetch("https://3.112.227.170/email/history")
        .then((res) => res.json());
      setHistory(updatedHistory);
    } catch (error) {
      console.error("API Error:", error);
      alert("Email failed to send.");
    } finally {
      setLoading(false);
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
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>

        <section className={styles.history}>
          <h2>Email History</h2>
          {history.length === 0 ? (
            <p>No email history found.</p>
          ) : (
            <ul>
              {history.map((record) => (
                <li key={record.id}>
                  <strong>To:</strong> {record.toAddress} <br />
                  <strong>Subject:</strong> {record.subject} <br />
                  <strong>Sent At:</strong>{" "}
                  {new Date(record.sentDate).toLocaleString()} <br />
                  <strong>Status:</strong>{" "}
                  {record.success ? "Success" : `Failed: ${record.errorMessage}`} <br />
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
