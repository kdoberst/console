import { useContext } from 'react';
import { ClusterContext } from '@console/app/src/components/detect-cluster/DetectCluster';

export const useActiveCluster = (): [string, (ns: string) => void] => {
  const { cluster, setCluster } = useContext(ClusterContext);
  return [cluster, setCluster];
};
