export const presets = ['module:metro-react-native-babel-preset'];
export const resolve = {
  fallback: {
    "crypto": require.resolve("crypto-browserify")
  }
};