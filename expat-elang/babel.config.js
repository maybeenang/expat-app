module.exports = api => {
  api.cache(false);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
