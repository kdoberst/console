import * as React from 'react';
import { useValuesForClusterContext } from './cluster';

type DetectClusterProps = {
  children: React.ReactNode;
};

type ContainerContextType = {
  cluster?: string;
  setCluster?: (cluster: string) => void;
};

export const ClusterContext = React.createContext<ContainerContextType>({});

const DetectCluster: React.FC<DetectClusterProps> = ({ children }) => {
  const { cluster, setCluster, loaded } = useValuesForClusterContext();
  return loaded ? (
    <ClusterContext.Provider value={{ cluster, setCluster }}>{children}</ClusterContext.Provider>
  ) : null;
};

export default DetectCluster;
