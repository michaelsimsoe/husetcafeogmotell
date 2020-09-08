// https://medium.com/javascript-in-plain-english/google-analytics-with-react-router-and-hooks-16d403ddc528
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LogRocket from 'logrocket';

declare global {
  interface Window {
    gtag?: (
      key: string,
      trackingId: string,
      config: { page_path: string }
    ) => void;
    ga: (
      key: string,
      config: { hitType: string; eventCategory: string; eventAction: string }
    ) => void;
  }
}

export const useTracking = () => {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      if (!window.gtag) return;

      LogRocket.getSessionURL(function (sessionURL) {
        window.ga('send', {
          hitType: 'event',
          eventCategory: 'LogRocket',
          eventAction: sessionURL,
        });
      });

      window.gtag('config', 'UA-167345367-1', { page_path: location.pathname });
    });

    return unlisten;
  }, [listen]);
};
