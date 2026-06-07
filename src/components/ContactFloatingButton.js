"use client";

import { useState } from "react";

const WHATSAPP_URL = "https://wa.me/message/7J7PQMKIB2G7O1";
const TELEGRAM_URL = "https://t.me/spaider_store_2";

export default function ContactFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 80 }}>
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "12px",
            alignItems: "stretch"
          }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn glass-btn-primary"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "190px", justifyContent: "center" }}
          >
            واتساب
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "190px", justifyContent: "center", background: "rgba(37, 99, 235, 0.16)", borderColor: "rgba(37, 99, 235, 0.28)" }}
          >
            تلجرام
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="التواصل معنا"
        className="glass-btn glass-btn-primary"
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "999px",
          padding: 0,
          fontSize: "1.3rem",
          boxShadow: "0 16px 30px rgba(0, 0, 0, 0.35)"
        }}
      >
        ☎
      </button>
    </div>
  );
}
