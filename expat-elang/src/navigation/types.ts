import {NavigatorScreenParams} from '@react-navigation/native';

// src/navigation/types.ts
export type RootStackParamList = {
  LoginV1: undefined;
  AppDrawer: undefined;
  GalleryDetail: {
    selectedImageId: string;
  };
  BlogDetail: {
    id: string;
  };
  BlogSearch: {
    query: string;
  };
  RentalDetail: {
    rentalId: string;
  };
  EventDetail: {
    eventId: string;
  };
};

export type DrawerParamList = {
  MainTabsDrawer: undefined;
  Blog: undefined;
  Rental: undefined;
  Forum: undefined;
  Gallery: undefined;
  Events: undefined;
  Restaurant: undefined;
  Lawyers: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Event: undefined;
  Rental: undefined;
  Forum: undefined;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
};

export type AccountStackParamList = {
  LoggedIn: undefined;
  Account: undefined;
};
