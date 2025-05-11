import {AdminCrew, Contract, SignatureType} from '../features/adminCrews/types';

export type RootStackParamList = {
  Login?: undefined;
  Drawer: undefined;

  AdminCrewDetail: {
    crewId: string;
  };

  AdminCrewContractDetail: {
    contract: Contract;
    crewName?: string | undefined;
    companyName?: string | undefined;
  };

  AdminCrewCreate: undefined;
  AdminCrewCreateContract: {crew: AdminCrew};

  SignaturePadScreen: {
    entityId: string;
    signatureType: SignatureType;
    relatedCrewId: string;
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
