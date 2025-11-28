"use client";

import { useState, useEffect } from "react";

interface BrandColors {
  primary: {
    light: string;
    dark: string;
  };
  error: {
    light: string;
    dark: string;
  };
}

const fallbackColors: BrandColors = {
  primary: {
    light: "#ff00ff",
    dark: "#00ff00",
  },
  error: {
    light: "#ff00ff",
    dark: "#00ff00",
  },
};

/**
 * Reads CSS custom properties (variables) from the document root
 * and returns computed brand colors for use with ThemeProvider
 */
export function useBrandColors(): BrandColors {
  const [brandColors, setBrandColors] = useState<BrandColors>(fallbackColors);

  useEffect(() => {
    // Only access window/document on client side
    if (typeof window === "undefined") {
      return;
    }

    let attempts = 0;
    const maxAttempts = 20; // Try for up to 1 second (20 * 50ms)

    const readCSSVariables = (): boolean => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const getCSSVariable = (varName: string, fallback: string): string => {
        const value = computedStyle.getPropertyValue(varName).trim();
        // Debug: log what we're getting
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[useBrandColors] ${varName}: "${value}" (using fallback: ${!value})`
          );
        }
        return value || fallback;
      };

      const primaryLightRaw = computedStyle
        .getPropertyValue("--brand-primary")
        .trim();
      const primaryDarkRaw = computedStyle
        .getPropertyValue("--brand-primary-light")
        .trim();

      // Check if we actually found the CSS variables
      const foundVariables = primaryLightRaw !== "" || primaryDarkRaw !== "";

      const colors: BrandColors = {
        primary: {
          light: primaryLightRaw || fallbackColors.primary.light,
          dark: primaryDarkRaw || fallbackColors.primary.dark,
        },
        error: {
          light: primaryLightRaw || fallbackColors.error.light,
          dark: primaryLightRaw || fallbackColors.error.dark,
        },
      };

      setBrandColors(colors);

      // Return true if we found variables, false otherwise
      return foundVariables;
    };

    const tryRead = () => {
      attempts++;
      const found = readCSSVariables();

      // If variables not found and we haven't exceeded max attempts, try again
      if (!found && attempts < maxAttempts) {
        setTimeout(tryRead, 50);
      } else if (!found && process.env.NODE_ENV === "development") {
        console.warn(
          "[useBrandColors] CSS variables not found after",
          attempts,
          "attempts. Using fallback colors."
        );
      }
    };

    // Start trying to read
    tryRead();

    // Also try after a longer delay as a final fallback
    const fallbackTimeout = setTimeout(() => {
      readCSSVariables();
    }, 1000);

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return brandColors;
}
