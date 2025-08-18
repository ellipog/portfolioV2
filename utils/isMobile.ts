import { useState, useEffect } from "react";

/**
 * Utility functions to detect mobile devices
 */

// Method 1: User Agent Detection
export function isMobileByUserAgent(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "android",
    "webos",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
    "mobile",
    "tablet",
  ];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
}

// Method 2: Screen Size Detection
export function isMobileByScreenSize(): boolean {
  if (typeof window === "undefined") return false;

  return window.innerWidth <= 768;
}

// Method 3: Touch Capability Detection
export function isMobileByTouchCapability(): boolean {
  if (typeof window === "undefined") return false;

  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Method 4: CSS Media Query Detection
export function isMobileByMediaQuery(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(max-width: 768px)").matches;
}

// Combined method - most reliable
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;

  // Check multiple indicators
  const hasMobileUserAgent = isMobileByUserAgent();
  const hasMobileScreen = isMobileByScreenSize();
  const hasTouchCapability = isMobileByTouchCapability();
  const hasMobileMediaQuery = isMobileByMediaQuery();

  // If any two or more indicators suggest mobile, consider it mobile
  const mobileIndicators = [
    hasMobileUserAgent,
    hasMobileScreen,
    hasTouchCapability,
    hasMobileMediaQuery,
  ].filter(Boolean).length;

  return mobileIndicators >= 2;
}

// React Hook for mobile detection
export function useIsMobile(): boolean {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobileDevice;
}
