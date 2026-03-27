import { useEffect } from "react";

const loadedAssets = new Set<string>();

/**
 * Hook to preload images in the browser.
 *
 * This hook creates Image instances for each provided URL, causing the browser to
 * download and cache the images before they are actually needed in the UI.
 * Preloading occurs only once per URL, preventing duplicate downloads.
 *
 * @param images - Array of image URLs to preload.
 *
 * @example
 * // Preloads images when the component mounts
 * usePreloadImages([
 *   '/images/hero-bg.jpg',
 *   '/images/avatar-large.png',
 *   'https://example.com/icon.svg'
 * ]);
 *
 * @remarks
 * - Images are loaded in the background without affecting component rendering.
 * - Duplicate URLs across different hook calls are ignored after the first load.
 * - The hook does not return any value and does not cause re-renders.
 */
export function usePreloadImages(images: string[]) {
  useEffect(() => {
    images.forEach((src) => {
      if (loadedAssets.has(src)) return;

      const img = new window.Image();
      img.src = src;

      loadedAssets.add(src);
    });
  }, [images]);
}
