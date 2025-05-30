declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    APP_ENVIRONMENT: string;
    API_KEY_USERNAME: string;
    API_KEY_PASSWORD: string;
    [key: string]: string | undefined;
  }

  export const Config: NativeConfig;
  export default Config;
}
