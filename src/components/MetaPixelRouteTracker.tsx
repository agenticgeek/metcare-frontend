import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMetaPixelContentName, trackPageView, trackViewContent } from '../utils/metaPixel';

let lastTrackedRouteKey = '';

export default function MetaPixelRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`;
    if (lastTrackedRouteKey === routeKey) {
      return;
    }

    lastTrackedRouteKey = routeKey;

    trackPageView();
    trackViewContent({
      content_name: getMetaPixelContentName(location.pathname),
    });
  }, [location.pathname, location.search]);

  return null;
}
