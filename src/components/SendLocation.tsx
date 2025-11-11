"use client";

import { useState } from "react";

export default function SendLocation() {
  const [status, setStatus] = useState("Menunggu interaksi...");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Browser tidak mendukung geolocation");
      return;
    }

    setStatus("Meminta izin lokasi...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setStatus("Lokasi didapat, mengirim...");

        const GAS_URL =
          "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

        fetch(GAS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });

        setStatus("Lokasi berhasil dikirim!");
      },

      (error) => {
        if (error.code === 1) setStatus("Izin lokasi ditolak");
        else if (error.code === 2) setStatus("Lokasi tidak tersedia");
        else if (error.code === 3) setStatus("Timeout");
        else setStatus("Error lokasi tidak diketahui");
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="p-4">
      <button
        onClick={requestLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Izinkan Lokasi & Kirim
      </button>

      <p className="mt-3">{status}</p>
    </div>
  );
}
