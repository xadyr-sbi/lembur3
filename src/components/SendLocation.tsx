"use client";

import React, { useEffect } from "react";

export default function AutoLocationSender() {
  // === KONFIGURASI URL APPSCRIPT ===
  const APPSCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Browser tidak mendukung geolocation");
      return;
    }

    // Meminta izin lokasi + mendapatkan GPS paling akurat
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        console.log("Lokasi terkirim:", latitude, longitude, "akurasi:", accuracy);

        // Kirim ke Apps Script
        fetch(`${APPSCRIPT_URL}?lat=${latitude}&lon=${longitude}`, {
          method: "GET",
        })
          .then((res) => res.text())
          .then((txt) => console.log("RESPON APPSCRIPT:", txt))
          .catch((err) => console.error("Gagal kirim lokasi", err));
      },
      (err) => {
        console.error("Gagal mendapatkan lokasi", err);
      },
      {
        enableHighAccuracy: true, // GPS paling akurat
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Pengiriman GPS Otomatis</h1>
      <p>Izin lokasi akan diminta otomatis & GPS akan dikirim tanpa tombol.</p>
    </div>
  );
}
