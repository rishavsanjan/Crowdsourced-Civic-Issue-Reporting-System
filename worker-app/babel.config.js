module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Your plugins here - make sure they're properly formatted
      'react-native-reanimated/plugin', // Should be last
    ],
  };
};