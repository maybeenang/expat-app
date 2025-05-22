module.exports = api => {
  api.cache(false);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          blacklist: null,
          path: '.env',
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
