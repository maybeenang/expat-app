export type DrawerParamList = {
  MainTabs: undefined;
  SepTerbuat: undefined;
  Page1: undefined;
  Page2: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Page11: undefined;
  Page12: undefined;
  Page13: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
} & DrawerParamList &
  BottomTabParamList;

