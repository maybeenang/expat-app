import {NavigatorScreenParams} from '@react-navigation/native';
import {RentalCategory} from '../types/rental';

// src/navigation/types.ts
export type RootStackParamList = {
  LoginV1: {
    goto: keyof RootStackParamList | undefined;
  };
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

  ForumDetail: {
    forumId: string;
  };
  ForumCreate: undefined;
  ForumUpdate: {
    forumId: string;
  };
  ForumSearch: undefined;
};

export type DrawerParamList = {
  MainTabsDrawer: undefined;
  Blog: undefined;
  Gallery: undefined;
  Restaurant: undefined;
  Lawyers: undefined;
  Jobs: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Event: undefined;
  Rental: {
    category: RentalCategory | undefined;
  };
  Forum: undefined;
  Notification: undefined;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
};

export type AccountStackParamList = {
  LoggedIn: undefined;
  Account: undefined;
};
