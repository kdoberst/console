import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import { setClusterID } from '@console/internal/actions/common';
import { setActiveCluster, formatNamespaceRoute } from '@console/internal/actions/ui';
import { getCluster } from '@console/internal/components/utils/link';
import { history } from '@console/internal/components/utils/router';
import { getActiveCluster } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';
import { useActiveNamespace } from '@console/shared';

export const useValuesForClusterContext = () => {
  const { pathname } = useLocation();
  const urlCluster = getCluster(pathname);

  const dispatch = useDispatch();
  const setCluster = React.useCallback(
    (clusterID: string) => {
      dispatch(setActiveCluster(clusterID));
    },
    [dispatch],
  );

  const [activeNamespace] = useActiveNamespace();
  const reduxCluster = useSelector((state: RootState) => getActiveCluster(state));
  React.useEffect(() => {
    const split = pathname.split('/').filter((x) => x);

    if (urlCluster && window.SERVER_FLAGS.clusters.includes(urlCluster)) {
      if (urlCluster !== reduxCluster) {
        dispatch(setActiveCluster(urlCluster));
        // FIXME (kdoberst) "bridge" should be pulled from a variable
        // Also, unsure if this is actually necessary
        window.localStorage.setItem(`bridge/last-cluster`, urlCluster);
      }
    } else if (reduxCluster && split[0] === 'k8s') {
      const newPath = formatNamespaceRoute(
        activeNamespace,
        window.location.pathname,
        window.location,
        true,
        reduxCluster,
      );
      history.pushPath(newPath);
    }
  }, [activeNamespace, dispatch, pathname, reduxCluster, urlCluster]);

  return {
    // KKD in theory we could use urlCluster || reduxUrl ... maybe avoid double load
    cluster: urlCluster,
    setCluster,
    loaded: true,
  };
};
