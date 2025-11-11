"use client";
import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    const sendLocation = async () => {
      if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = pos.coords.accuracy; // meter

          // ==== CEK AKURASI GPS ====
          const akurat = acc <= 30 ? "AKURAT" : "TIDAK AKURAT";

          // ==== REVERSE GEOCODING (Google Maps API gratis via Nominatim) ====
          const getAddress = async () => {
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const data = await res.json();
              return data.display_name || "Alamat tidak ditemukan";
            } catch {
              return "Alamat tidak ditemukan";
            }
          };

          const address = await getAddress();

          const lokasi = `${lat},${lng}`;

          const url =
            "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

          // kirim ke Apps Script
          await fetch(url + `?lokasi=${lokasi}&kota=${address}&foto=${akurat}`);
        },
        (err) => {
          alert("Nyalakan lokasi perangkat");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    sendLocation();
  }, []);

  return null
}
