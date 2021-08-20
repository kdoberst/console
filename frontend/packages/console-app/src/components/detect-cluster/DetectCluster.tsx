import * as React from 'react';
import { useValuesForClusterContext } from './cluster';

type DetectClusterProps = {
  children: React.ReactNode;
};

type ContainerContextType = {
  cluster?: string;
  setCluster?: (cluster: string) => void;
};

const ContainerContext = React.createContext<ContainerContextType>({});

const DetectCluster: React.FC<DetectClusterProps> = ({ children }) => {
  const { cluster, setCluster, loaded } = useValuesForClusterContext();
  // const cluster = '';
  // const setCluster = () => {};
  // const loaded = true;

  return loaded ? (
    <ContainerContext.Provider value={{ cluster, setCluster }}>
      {children}
    </ContainerContext.Provider>
  ) : null;
};

export default DetectCluster;
