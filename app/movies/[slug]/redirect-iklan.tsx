"use client";

import { useEffect } from "react";

export function RedirectIklan({ link }: { link: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = link;
    }, 300);
    return () => clearTimeout(timer);
  }, [link]);

  return null;
}
