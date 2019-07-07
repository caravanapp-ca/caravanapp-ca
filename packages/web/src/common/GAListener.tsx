import History from 'history';
import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface GAListenerProps extends RouteComponentProps<{}> {
  children: any;
  trackingId?: string;
}

const sendPageView = (location: History.Location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
};

export const GAListener = withRouter(
  ({ trackingId, history, children }: GAListenerProps) => {
    useEffect(() => {
      if (trackingId && history) {
        ReactGA.initialize(trackingId);
        sendPageView(history.location);
        const unregisterListener = history.listen(sendPageView);
        // Cleanup for effect from first render
        return () => {
          unregisterListener();
        };
      }
    }, [trackingId, history]);
    return children;
  }
);
