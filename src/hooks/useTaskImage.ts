import { useEffect, useState } from 'react';
import { fetchTaskImage } from '../services/taskService';

export function useTaskImage(picUrl: string | undefined) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!picUrl) {
      return;
    }

    let objectUrl: string | null = null;
    let isCancelled = false;

    const loadImage = async () => {
      setIsLoading(true);

      try {
        const blob = await fetchTaskImage(picUrl);
        if (isCancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch {
        if (!isCancelled) setImageSrc(null);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [picUrl]);

  if (!picUrl) {
    return { imageSrc: null, isLoading: false };
  }

  return { imageSrc, isLoading };
}