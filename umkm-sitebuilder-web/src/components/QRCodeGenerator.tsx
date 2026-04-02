"use client";

/**
 * QRCodeGenerator — Client Component
 *
 * Generate QR code dari URL toko dengan opsional logo overlay di tengah.
 * Fitur: preview QR, download PNG, copy URL, share via WA.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import type { UmkmSite } from "@/lib/types";
import { buildWaContactUrl } from "@/lib/wa";

interface QRCodeGeneratorProps {
  site: UmkmSite;
}

const QR_SIZE = 300;
const LOGO_SIZE = 60;

export default function QRCodeGenerator({ site }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  const siteUrl = site.site_url;

  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render QR code ke canvas
    await QRCode.toCanvas(canvas, siteUrl, {
      width: QR_SIZE,
      margin: 2,
      color: { dark: "#1e1b4b", light: "#ffffff" },
    });

    // Overlay logo di tengah jika ada
    if (site.logo_url) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const x = (QR_SIZE - LOGO_SIZE) / 2;
        const y = (QR_SIZE - LOGO_SIZE) / 2;
        // Latar putih untuk logo
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 4, LOGO_SIZE + 8, LOGO_SIZE + 8, 8);
        ctx.fill();
        ctx.drawImage(img, x, y, LOGO_SIZE, LOGO_SIZE);
        setQrReady(true);
      };
      img.onerror = () => setQrReady(true);
      img.src = site.logo_url;
    } else {
      setQrReady(true);
    }
  }, [siteUrl, site.logo_url]);

  useEffect(() => {
    renderQR();
  }, [renderQR]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qrcode-${site.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWa() {
    if (!site.phone_wa) return;
    const waUrl = buildWaContactUrl(site.phone_wa, site.name);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  const shareText = `Kunjungi toko online saya: ${siteUrl}`;
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm mx-auto text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">QR Code Toko</h2>
      <p className="text-xs text-gray-400 mb-6 break-all">{siteUrl}</p>

      {/* Canvas QR */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={QR_SIZE}
          height={QR_SIZE}
          className="rounded-xl border border-gray-100"
          style={{ opacity: qrReady ? 1 : 0.4, transition: "opacity 0.3s" }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleDownload}
          disabled={!qrReady}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          ⬇️ Download PNG
        </button>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          {copied ? "✅ URL Disalin!" : "📋 Salin URL Toko"}
        </button>

        <a
          href={waShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition flex items-center justify-center gap-2"
          style={{ backgroundColor: "#25D366" }}
        >
          <span>📲</span> Bagikan via WhatsApp
        </a>

        {site.phone_wa && (
          <button
            onClick={handleShareWa}
            className="w-full py-2.5 rounded-xl text-sm border border-green-200 text-green-700 hover:bg-green-50 transition"
          >
            💬 Hubungi Toko via WA
          </button>
        )}
      </div>
    </div>
  );
}

