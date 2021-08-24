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
import { STORAGE_PREFIX } from '@console/shared/src/constants/common';

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
    if (urlCluster && window.SERVER_FLAGS.clusters.includes(urlCluster)) {
      if (urlCluster !== reduxCluster) {
        dispatch(setActiveCluster(urlCluster));
        window.localStorage.setItem(`${STORAGE_PREFIX}/last-cluster`, urlCluster);
      }
    } else if (reduxCluster) {
      const newPath = formatNamespaceRoute(
        activeNamespace,
        window.location.pathname,
        window.location,
        true,
        reduxCluster,
      );

      if (newPath !== window.location.pathname) {
        history.pushPath(newPath);
      }
    }
  }, [activeNamespace, dispatch, pathname, reduxCluster, urlCluster]);

  return {
    cluster: urlCluster || reduxCluster,
    setCluster,
    loaded: true,
  };
};
