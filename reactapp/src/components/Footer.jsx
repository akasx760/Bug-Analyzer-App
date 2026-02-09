// Footer.jsx
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Bug Analyzer. All rights reserved.</p>
        <p className="footer-tagline">Track, Analyze, Resolve</p>
      </div>
    </footer>
  );
}

export default Footer;