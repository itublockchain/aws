const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withBleAdvertise(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      // iOS native kod düzenlemeleri burada yapılabilir
      return config;
    },
  ]);
};
