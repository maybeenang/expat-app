export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Category: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Category: undefined;
  SepTerbuat: undefined;
} & DrawerParamList;
