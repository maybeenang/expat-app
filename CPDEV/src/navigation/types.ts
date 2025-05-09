import {Contract} from '../features/adminCrews/types';

export type RootStackParamList = {
  Login?: undefined;
  Drawer: undefined;

  AdminCrewDetail: {
    crewId: string;
  };

  AdminCrewContractDetail: {
    contract: Contract;
    crewName: string | undefined;
  };

  ContractDetail: {
    contractId: string;
  };
};

export type DrawerParamList = {
  BottomTab: undefined;
  AdminCrew: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
};
