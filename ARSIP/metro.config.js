const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enableSymlinks = true;
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg',
);

config.resolver.sourceExts.push('svg');
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = mergeConfig(config, {});
