"use client";
import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    const sendLocation = async () => {
      // ==== GENERATE UUID UNTUK KOLOM NAMA ====
      const generateUUID = () => {
        // Cek apakah sudah ada UUID di localStorage
        let uuid = localStorage.getItem("device_uuid");
        
        if (!uuid) {
          // Generate UUID baru
          uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          // Simpan ke localStorage
          localStorage.setItem("device_uuid", uuid);
        }
        
        return uuid;
      };

      // Ambil UUID untuk kolom nama
      const uuid = generateUUID();

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

          // kirim ke Apps Script DENGAN UUID DI KOLOM NAMA
          await fetch(url + `?lokasi=${lokasi}&kota=${address}&foto=${akurat}&nama=${uuid}`);
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
