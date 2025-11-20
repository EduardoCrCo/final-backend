import { useState, useEffect, useRef, useCallback } from 'react';

interface ContainerDimensions {
  width: number;
  height: number;
}

interface UseContainerDimensionsReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  dimensions: ContainerDimensions;
  isReady: boolean;
}

export const useContainerDimensions = (minWidth = 320, minHeight = 200): UseContainerDimensionsReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ContainerDimensions>({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setDimensions({ width: offsetWidth, height: offsetHeight });
        if (!isReady && offsetWidth >= minWidth && offsetHeight >= minHeight) {
          setIsReady(true);
        }
      }
    }
  }, [isReady, minWidth, minHeight]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateDimensions);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback timer
    const timer = setTimeout(() => {
      updateDimensions();
      if (!isReady) {
        setIsReady(true);
      }
    }, 200);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [updateDimensions, isReady]);

  return {
    containerRef,
    dimensions,
    isReady
  };
};