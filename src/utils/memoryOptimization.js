import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Custom hook to prevent memory leaks from excessive re-renders
export const useMemoryOptimization = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    // Log if component is re-rendering too frequently
    if (timeSinceLastRender < 100 && renderCount.current > 10) {
      console.warn(`Component re-rendering too frequently: ${renderCount.current} renders in ${now - lastRenderTime.current}ms`);
    }
    
    lastRenderTime.current = now;
  });

  return { renderCount: renderCount.current };
};

// Optimized useState that prevents unnecessary re-renders
export const useOptimizedState = (initialValue) => {
  const [state, setState] = useState(initialValue);
  
  const optimizedSetState = useCallback((newValue) => {
    setState(prevState => {
      // Only update if value actually changed
      if (typeof newValue === 'function') {
        const computed = newValue(prevState);
        return JSON.stringify(computed) !== JSON.stringify(prevState) ? computed : prevState;
      }
      return JSON.stringify(newValue) !== JSON.stringify(prevState) ? newValue : prevState;
    });
  }, []);

  return [state, optimizedSetState];
};

// Debounced callback to prevent excessive API calls or calculations
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Memoized calculation hook
export const useMemoizedCalculation = (calculation, deps) => {
  return useMemo(() => {
    try {
      return calculation();
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, deps);
};

export default {
  useMemoryOptimization,
  useOptimizedState,
  useDebouncedCallback,
  useMemoizedCalculation
};
