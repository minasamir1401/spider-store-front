"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const WHATSAPP_SUPPORT_1 = "https://wa.me/16728972935";
const WHATSAPP_SUPPORT_2 = "https://wa.me/201552672948";
const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/DINRDwU2lVjFcGRowxT3m5";
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VbD0n6C17En1xFJRPV0H";
const TELEGRAM_CHANNEL = "https://t.me/ARABTECSUPPURT";
const FACEBOOK_PAGE = "https://www.facebook.com/share/1Ehtc4bMXy/";
const TIKTOK_ACCOUNT = "https://tiktok.com/@arabtechsuppurt";

export default function ContactFloatingButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="contact-floating-btn-wrap" style={{ zIndex: 1100 }}>
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
          {/* WhatsApp Support 1 */}
          <a
            href={WHATSAPP_SUPPORT_1}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn glass-btn-primary"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
          >
            🟢 واتساب الدعم (1)
          </a>

          {/* WhatsApp Support 2 */}
          <a
            href={WHATSAPP_SUPPORT_2}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn glass-btn-primary"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
          >
            🟢 واتساب الدعم (2)
          </a>

          {/* WhatsApp Community */}
          <a
            href={WHATSAPP_COMMUNITY}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", background: "rgba(52, 211, 153, 0.1)", borderColor: "rgba(52, 211, 153, 0.2)", color: "#34d399" }}
          >
            💬 مجتمع واتساب عرب تيك
          </a>

          {/* WhatsApp Channel */}
          <a
            href={WHATSAPP_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", background: "rgba(52, 211, 153, 0.1)", borderColor: "rgba(52, 211, 153, 0.2)", color: "#34d399" }}
          >
            📢 قناة واتساب عرب تيك
          </a>

          {/* Telegram Channel */}
          <a
            href={TELEGRAM_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", background: "rgba(37, 99, 235, 0.16)", borderColor: "rgba(37, 99, 235, 0.28)", color: "#60a5fa" }}
          >
            ✈️ قناة تلجرام عرب تيك
          </a>

          {/* Facebook Page */}
          <a
            href={FACEBOOK_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", background: "rgba(24, 119, 242, 0.1)", borderColor: "rgba(24, 119, 242, 0.2)", color: "#478bfb" }}
          >
            📘 صفحة فيسبوك عرب تيك
          </a>

          {/* TikTok Account */}
          <a
            href={TIKTOK_ACCOUNT}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn"
            style={{ padding: "12px 16px", borderRadius: "14px", minWidth: "220px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", background: "rgba(254, 44, 85, 0.1)", borderColor: "rgba(254, 44, 85, 0.2)", color: "#fe2c55" }}
          >
            🎵 حساب تيك توك عرب تيك
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
