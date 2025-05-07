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

  RentalCreate: undefined;
  RentalUpdate: {
    rentalId: string;
  };

  EventDetail: {
    eventId: string;
    categoryId?: string;
  };
  EventCreate: undefined;
  EventUpdate: {
    eventId: string;
    categoryId?: string;
  };

  ForumDetail: {
    forumId: string;
  };
  ForumCreate: undefined;
  ForumUpdate: {
    forumId: string;
  };
  ForumSearch: undefined;

  JobDetail: {
    jobId: string;
    categoryId?: string;
  };
  JobCreate: undefined;
  JobUpdate: {
    jobId: string;
    categoryId?: string;
  };
  JobSearch: undefined;

  Chat: undefined;
  ChatDetail: {
    chatId: string;
    participantName: string;
    participantAvatarUrl: string;
  };
};

export type DrawerParamList = {
  MainTabsDrawer: undefined;
  Blog: undefined;
  Gallery: undefined;
  Restaurant: undefined;
  Lawyers: undefined;
  Jobs: undefined;
  Profile: undefined;
  ChangePassword: undefined;
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
