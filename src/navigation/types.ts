import {NavigatorScreenParams} from '@react-navigation/native';

// src/navigation/types.ts
export type RootStackParamList = {
  LoginV1: undefined;
  MainTabs: undefined;
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

export type MainTabParamList = {
  Explore: undefined;
  Event: undefined;
  Gallery: undefined;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
  Blog: undefined;
};

export type AccountStackParamList = {
  LoggedIn: undefined;
  Account: undefined;
};
