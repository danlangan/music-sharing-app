module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  resolve: {
    fallback: {
        "crypto": require.resolve("crypto-browserify")
    }
}
};