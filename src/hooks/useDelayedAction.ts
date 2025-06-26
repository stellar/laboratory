import { useEffect, useRef, useCallback } from "react";

interface UseDelayedActionOptions {
  delay: number;
  enabled?: boolean;
}

/**
 * Custom hook that executes an action after a delay with proper cleanup.
 * Automatically clears the timeout when the component unmounts or dependencies change.
 *
 * @param action - The function to execute after the delay (can be async)
 * @param options - Configuration options including delay and enabled state
 * @param dependencies - Array of dependencies that trigger the effect to re-run
 * @returns Object with cancel function to manually cancel the delayed action
 *
 * @example
 * ```tsx
 * // Basic usage
 * useDelayedAction(
 *   () => console.log('Delayed action executed'),
 *   { delay: 1000 },
 *   [someDependency]
 * );
 *
 * // With conditional execution
 * const { cancel } = useDelayedAction(
 *   async () => {
 *     await someAsyncOperation();
 *   },
 *   {
 *     delay: 2000,
 *     enabled: shouldExecute
 *   },
 *   [shouldExecute]
 * );
 *
 * // Manual cancellation
 * const handleCancel = () => cancel();
 * ```
 */
export const useDelayedAction = (
  action: () => void | Promise<void>,
  options: UseDelayedActionOptions,
  dependencies: React.DependencyList = [],
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    cancel();

    // Only set up the timeout if enabled (defaults to true)
    if (options.enabled !== false) {
      timeoutRef.current = setTimeout(async () => {
        await action();
        timeoutRef.current = null;
      }, options.delay);
    }

    // Cleanup function
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, options.delay, options.enabled, cancel, ...dependencies]);

  return { cancel };
};
