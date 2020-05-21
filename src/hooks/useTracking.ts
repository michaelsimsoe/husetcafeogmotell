// https://medium.com/javascript-in-plain-english/google-analytics-with-react-router-and-hooks-16d403ddc528
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (
      key: string,
      trackingId: string,
      config: { page_path: string }
    ) => void;
  }
}

export const useTracking = () => {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      if (!window.gtag) return;

      window.gtag('config', 'G-B80TJLY86T', { page_path: location.pathname });
    });

    return unlisten;
  }, [listen]);
};
