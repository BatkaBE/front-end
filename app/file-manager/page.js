"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("https://3.112.227.170/s3/files", {
        method: "GET",
        mode: "cors",
      });
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://3.112.227.170/s3/upload", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const result = await response.text();
      setUploadStatus(`Upload successful: ${result}`);
      fetchFiles(); // Refresh file list
      setSelectedFile(null);
      document.getElementById("fileInput").value = ""; // Clear file input
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const response = await fetch(`https://3.112.227.170/s3/delete/${filename}`, {
        method: "DELETE",
        mode: "cors",
      });

      if (!response.ok) throw new Error("Delete failed");
      
      setDeleteStatus(`${filename} deleted successfully`);
      fetchFiles(); // Refresh file list
    } catch (error) {
      setDeleteStatus(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span>File Manager</span>
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
        <h1>File Manager</h1>
        
        {/* Upload Section */}
        <section className={styles.section}>
          <h2>Upload File</h2>
          <form onSubmit={handleUpload}>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button type="submit" className={styles.button}>
              Upload
            </button>
          </form>
          {uploadStatus && <p className={styles.status}>{uploadStatus}</p>}
        </section>

        {/* File List Section */}
        <section className={styles.section}>
          <h2>Files in S3</h2>
          {deleteStatus && <p className={styles.status}>{deleteStatus}</p>}
          {files.length === 0 ? (
            <p>No files found</p>
          ) : (
            <ul className={styles.fileList}>
              {files.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <span>{file}</span>
                  <button
                    onClick={() => handleDelete(file)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}