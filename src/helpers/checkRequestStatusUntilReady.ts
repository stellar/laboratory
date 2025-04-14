import { AnyObject } from "@/types/types";

export const checkRequestStatusUntilReady = async ({
  url,
  options,
  readyProp,
}: {
  url: string;
  options: AnyObject;
  readyProp: string;
}): Promise<boolean> => {
  // Check every 10 seconds
  const interval = 1000 * 10;
  // Try for max 10 minutes
  const MAX_ATTEMPTS = 6 * 10;
  // Max retries on error
  const MAX_ERROR_ATTEMPTS = 3;

  let attempts = 0;
  let errorAttempts = 0;

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      attempts++;

      try {
        const response = await fetch(url, options);
        const responseJson = await response.json();

        if (responseJson[readyProp]) {
          clearInterval(intervalId);
          resolve(true);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
          reject(false);
        }
      } catch (e) {
        // Retry on error
        if (errorAttempts < MAX_ERROR_ATTEMPTS) {
          errorAttempts++;
        } else {
          clearInterval(intervalId);
          reject(e);
        }
      }
    };

    checkStatus();

    const intervalId = setInterval(checkStatus, interval);
  });
};
