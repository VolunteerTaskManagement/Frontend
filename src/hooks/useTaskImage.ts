import { useEffect, useState } from 'react';
import { fetchTaskImage } from '../services/taskService';

function getCacheKey(picUrl: string): string {
  try {
    const url = new URL(picUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return picUrl;
  }
}

const imageCache = new Map<string, string>();

const inFlightControllers = new Map<string, AbortController>();
const inFlightPromises = new Map<string, Promise<string>>();
const interestCounts = new Map<string, number>();

function acquireImage(picUrl: string, cacheKey: string): Promise<string> {
  const cached = imageCache.get(cacheKey);
  if (cached) return Promise.resolve(cached);

  interestCounts.set(cacheKey, (interestCounts.get(cacheKey) ?? 0) + 1);

  const existing = inFlightPromises.get(cacheKey);
  if (existing) return existing;

  const controller = new AbortController();
  inFlightControllers.set(cacheKey, controller);

  const promise = fetchTaskImage(picUrl, controller.signal)
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      imageCache.set(cacheKey, objectUrl);
      inFlightPromises.delete(cacheKey);
      inFlightControllers.delete(cacheKey);
      interestCounts.delete(cacheKey);
      return objectUrl;
    })
    .catch((err) => {
      inFlightPromises.delete(cacheKey);
      inFlightControllers.delete(cacheKey);
      interestCounts.delete(cacheKey);
      throw err;
    });

  inFlightPromises.set(cacheKey, promise);
  return promise;
}

function releaseImage(cacheKey: string) {
  const count = interestCounts.get(cacheKey);
  if (count === undefined) return;

  if (count <= 1) {
    interestCounts.delete(cacheKey);
    const controller = inFlightControllers.get(cacheKey);
    if (controller) {
      controller.abort();
      inFlightControllers.delete(cacheKey);
      inFlightPromises.delete(cacheKey);
    }
  } else {
    interestCounts.set(cacheKey, count - 1);
  }
}

export function useTaskImage(picUrl: string | undefined) {
  const cacheKey = picUrl ? getCacheKey(picUrl) : undefined;

  const [imageSrc, setImageSrc] = useState<string | null>(
    cacheKey ? imageCache.get(cacheKey) ?? null : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!picUrl || !cacheKey) return;

    const cached = imageCache.get(cacheKey);
    if (cached) {
      setImageSrc(cached);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    acquireImage(picUrl, cacheKey)
      .then((objectUrl) => {
        if (!isCancelled) setImageSrc(objectUrl);
      })
      .catch(() => {
        if (!isCancelled) setImageSrc(null);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
      releaseImage(cacheKey);
    };
  }, [picUrl, cacheKey]);

  if (!picUrl) {
    return { imageSrc: null, isLoading: false };
  }

  return { imageSrc, isLoading };
}