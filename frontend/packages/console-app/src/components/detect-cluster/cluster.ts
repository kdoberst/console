import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import { setClusterID } from '@console/internal/actions/common';
import { setActiveCluster } from '@console/internal/actions/ui';
import { getCluster } from '@console/internal/components/utils/link';
import { history } from '@console/internal/components/utils/router';
import { getActiveCluster } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';

// import { formatNamespaceRoute } from '@console/internal/actions/ui';

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

  const reduxCluster = useSelector((state: RootState) => getActiveCluster(state));
  React.useEffect(() => {
    // console.log("KKD - path:", pathname)
    // console.log("KKD - urlcluster", urlCluster)

    const split = pathname.split('/').filter((x) => x);
    //  console.log("KKD SPLIT:", split[0])

    // console.log("KKD window.SERVER_FLAGS", window.SERVER_FLAGS.clusters)
    if (urlCluster && window.SERVER_FLAGS.clusters.includes(urlCluster)) {
      if (urlCluster !== reduxCluster) {
        dispatch(setActiveCluster(urlCluster));
        // FIXME (kdoberst) "bridge" should be pulled from a variable
        // Also, unsure if this is actually necessary
        //  console.log("KKD Setting local storage")
        window.localStorage.setItem(`bridge/last-cluster`, urlCluster);
      }
    } else if (reduxCluster && split[0] === 'k8s') {
      //   console.log("KKD: there is a redux cluster:", reduxCluster)
      // FIXME (kdoberste) This should be with the getCluster function so they can use the same patterns
      // const split = pathname.split('/').filter((x) => x);
      if (urlCluster) {
        // an unknown cluster was passed via the URL
        split.splice(1, 1);
      }

      split.splice(1, 0, reduxCluster);
      const newPath = `/${split.join('/')}`;
      history.pushPath(newPath);
    }
  }, [dispatch, pathname, reduxCluster, urlCluster]);

  return {
    cluster: urlCluster,
    setCluster,
    loaded: true,
  };
};
